const router = require("express").Router();

const { getAllIncomes, createIncome } = require("../controller/IncomeController");

router.get("/", getAllIncomes);
router.post("/create", createIncome);

module.exports = router;
