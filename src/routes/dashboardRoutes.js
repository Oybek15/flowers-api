const { getTodayOrdersProccess, getDashboardIncomes, getDashboardSpends } = require("../controller/DashboardController");

const router = require("express").Router();

router.get("/today-orders-proccess", getTodayOrdersProccess);
router.get("/incomes", getDashboardIncomes);
router.get("/spends", getDashboardSpends);

module.exports = router;
