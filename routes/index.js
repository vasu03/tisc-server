const express = require("express");
const router = express.Router();

const healthController = require("../controllers/health.controller");
const observableController = require("../controllers/observable.controller");

const auth = require("../middleware/auth.middleware");

router.get("/health", healthController.healthCheck);

router.get("/observables", auth, observableController.getObservables);
router.get("/observable/enrich/:id", auth, observableController.getEnrichment);

module.exports = router;
