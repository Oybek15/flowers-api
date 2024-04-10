const router = require("express").Router();

const { getAllProducts, getOneProduct, createProduct, updateProduct, deleteProduct } = require("../controller/ProductController");

router.get("/", getAllProducts);
router.get("/:id", getOneProduct);
router.post("/create", createProduct);
router.put("/edit/:id", updateProduct);
router.delete("/delete/:id", deleteProduct);

module.exports = router;
