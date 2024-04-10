const router = require("express").Router();

const { getAllSales, getOneSale, createSale, updateSale, deleteSale } = require("../controller/SaleController");

router.get("/", getAllSales);
router.get("/:id", getOneSale);
router.post("/create", createSale);
router.put("/edit/:id", updateSale);
router.delete("/delete/:id", deleteSale);

module.exports = router;
