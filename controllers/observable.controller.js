const Observable = require("../models/observable.model");

// GET /observables
exports.getObservables = async (req, res, next) => {
  try {
    const { cursor, limit = 50 } = req.query;

    let query = {};
    if (cursor) {
      query._id = { $gt: cursor };
    }

    const data = await Observable.find(query).sort({ _id: 1 }).limit(parseInt(limit));

    const response = data.map((i) => ({
      id: i._id,
      value: i.value,
      type: i.type,
      source: "ThreatFox Feed",
      malware: i.malware,
      malware_printable: i.malware_printable,
    }));

    const nextCursor = data.length ? data[data.length - 1]._id : null;

    res.status(200).json({
      status: "success",
      message: "Observables fetched successfully",
      data: response,
      next_cursor: nextCursor,
    });
  } catch (err) {
    next(err);
  }
};

// GET /observable/enrich/:id
exports.getEnrichment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const i = await Observable.findById(id);

    if (!i) {
      return res.status(404).json({
        status: "error",
        message: "Observable not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Enrichment data fetched successfully",
      data: {
        id: i._id,
        tags: i.tags,
        confidence: i.confidence,
        threat_score: i.threat_score,
        threat_level: i.threat_level,
        threat_severity: i.threat_severity,
        reputation: i.reputation,
        criticality: i.criticality,
        first_seen: i.first_seen,
        last_seen: i.last_seen,
        description: i.description,
        additional_context: i.additional_context,
      },
    });
  } catch (err) {
    next(err);
  }
};
