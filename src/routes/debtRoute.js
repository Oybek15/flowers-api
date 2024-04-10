const router = require("express").Router();

const { getAllDebts, getOneDebt, createDebt, deleteDebt, returnDebt } = require("../controller/DebtController");

router.get("/", getAllDebts);
router.get("/:id", getOneDebt);
router.post("/create", createDebt);
router.delete("/delete/:id", deleteDebt);
router.post("/return/:id", returnDebt);

module.exports = router;
