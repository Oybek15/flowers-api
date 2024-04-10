const router = require("express").Router();

const { getAllProductTypes, getOneProductType, createProductType, updateProductType, deleteProductType } = require("../controller/ProductTypeController");

router.get("/", getAllProductTypes);
router.get("/:id", getOneProductType);
router.post("/create", createProductType);
router.put("/edit/:id", updateProductType);
router.delete("/delete/:id", deleteProductType);

module.exports = router;
