const router = require("express").Router();

const { getAllSpendTypes, getOneSpendType, createSpendType, updateSpendType, deleteSpendType } = require("../controller/SpendTypeController");

router.get("/", getAllSpendTypes);
router.get("/:id", getOneSpendType);
router.post("/create", createSpendType);
router.put("/edit/:id", updateSpendType);
router.delete("/delete/:id", deleteSpendType);

module.exports = router;
