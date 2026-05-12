const mongoose = require("mongoose");

const observableSchema = new mongoose.Schema(
  {
    value: { type: String, required: true, unique: true, index: true },
    type: String,
    source: String,

    malware: String,
    malware_printable: String,
    malware_alias: String,

    threat_type: String,
    threat_type_desc: String,

    confidence: Number,
    threat_score: Number,
    threat_level: String,
    threat_severity: String,
    reputation: String,
    criticality: Number,

    first_seen: Date,
    last_seen: Date,

    tags: [String],

    description: String,
    additional_context: String,

    generated_at: Date,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Observable", observableSchema);
