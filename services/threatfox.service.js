const axios = require("axios");
const Observable = require("../models/observable.model");

function toISO(dateStr) {
  try {
    return new Date(dateStr);
  } catch {
    return new Date();
  }
}

function calculateRisks(ioc) {
  let confidence = parseInt(ioc.confidence_level || 50);
  let threat_score = confidence;

  if ((ioc.malware_printable || "").toLowerCase().includes("ransomware")) {
    threat_score = Math.min(100, threat_score + 10);
  }

  let threat_severity = "low";
  let threat_level = "low";

  if (threat_score >= 90) {
    threat_severity = "high";
    threat_level = "critical";
  } else if (threat_score >= 70) {
    threat_severity = "medium";
    threat_level = "medium";
  }

  let criticality = 1;
  if (threat_score > 90) criticality = 5;
  else if (threat_score > 75) criticality = 4;
  else if (threat_score > 50) criticality = 3;
  else if (threat_score > 25) criticality = 2;

  return { threat_score, threat_severity, threat_level, criticality };
}

const fetchThreatFox = async () => {
  try {
    const res = await axios.post(
      process.env.THREATFOX_API,
      {
        query: "get_iocs",
        days: 1,
      },
      {
        headers: {
          "Auth-Key": process.env.THREATFOX_API_KEY,
          "Content-Type": "application/json",
        },
      },
    );

    const data = res.data.data || [];

    for (const ioc of data) {
      let type = "other";
      if (ioc.ioc_type.includes("ip")) type = "ip";
      else if (ioc.ioc_type.includes("domain")) type = "domain";
      else if (ioc.ioc_type.includes("sha256")) type = "sha256";
      else if (ioc.ioc_type.includes("url")) type = "url";

      const risk = calculateRisks(ioc);

      await Observable.updateOne(
        { value: ioc.ioc }, // unique key
        {
          $set: {
            value: ioc.ioc,
            type,
            source: "ThreatFox Feed",

            malware: ioc.malware,
            malware_printable: ioc.malware_printable,
            malware_alias: ioc.malware_alias,

            threat_type: ioc.threat_type,
            threat_type_desc: ioc.threat_type_desc,

            confidence: parseInt(ioc.confidence_level || 70),

            threat_score: risk.threat_score,
            threat_level: risk.threat_level,
            threat_severity: risk.threat_severity,

            reputation: "malicious",
            criticality: risk.criticality,

            first_seen: toISO(ioc.first_seen),
            last_seen: ioc.last_seen ? toISO(ioc.last_seen) : null,

            tags: ioc.tags || [],

            description: `Malware: ${ioc.malware_printable || "Unknown"} | Threat Type: ${ioc.threat_type || "Generic"}`,
            additional_context: `Reference: ${ioc.reference || "N/A"} | Malware: ${ioc.malware_malpedia || "N/A"}`,

            generated_at: toISO(ioc.first_seen),
          },
        },
        {
          upsert: true, // 🔥 KEY POINT
        },
      );
    }

    console.log(`✅ ThreatFox sync complete (${data.length} records)`);
  } catch (err) {
    console.error("❌ ThreatFox fetch error:", err.message);
  }
};

module.exports = fetchThreatFox;
