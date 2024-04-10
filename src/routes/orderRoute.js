const router = require("express").Router();

const { getAllOrders, getOneOrder, createOrder, deleteOrder, transferToDone, getLastOrders } = require("../controller/OrderController");

router.get("/", getAllOrders);
router.get("/lasts", getLastOrders);
router.get("/:id", getOneOrder);
router.post("/create", createOrder);
router.delete("/delete/:id", deleteOrder);
router.post("/transfer-to-done/:id", transferToDone);

module.exports = router;
