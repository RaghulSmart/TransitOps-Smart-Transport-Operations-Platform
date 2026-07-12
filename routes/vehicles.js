const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const controller = require("../controllers/vehicleController");

router.get("/", auth, controller.index);

router.post("/save", auth, controller.save);

router.get("/get/:id", auth, controller.getVehicle);

router.post("/update/:id", auth, controller.update);

router.delete("/delete/:id", auth, controller.delete);

module.exports = router;