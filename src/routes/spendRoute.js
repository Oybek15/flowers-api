const router = require("express").Router();

const { getAllSpends, createSpend, deleteSpend } = require("../controller/SpendController");

router.get("/", getAllSpends);
router.post("/create", createSpend);
router.delete("/delete/:id", deleteSpend);

module.exports = router;
