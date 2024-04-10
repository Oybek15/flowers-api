const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoute = require("./routes/productRoute");
const productTypeRoute = require("./routes/productTypeRoute");
const orderRoute = require("./routes/orderRoute");
const saleRoute = require("./routes/saleRoute");
const debtRoute = require("./routes/debtRoute");
const incomeRoute = require("./routes/incomeRoute");
const spendTypeRoute = require("./routes/spendTypeRoute");
const spendRoute = require("./routes/spendRoute");

const dashboardRoute = require("./routes/dashboardRoutes");

const { isAuthenticated, requestLogger } = require("./middlewares/middlewares");

dotenv.config();

const app = express();
const port = process.env.APP_PORT || 5000;

app.use(express.json());
app.use(cors());

app.use(requestLogger);

app.get("/", (req, res) => {
  res.status(404).send("PAGE NOT FOUND");
});
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", isAuthenticated, productRoute);
app.use("/api/product-types", isAuthenticated, productTypeRoute);
app.use("/api/orders", isAuthenticated, orderRoute);
app.use("/api/sales", isAuthenticated, saleRoute);
app.use("/api/debts", isAuthenticated, debtRoute);
app.use("/api/incomes", isAuthenticated, incomeRoute);
app.use("/api/spends", isAuthenticated, spendRoute);
app.use("/api/spend-types", isAuthenticated, spendTypeRoute);

app.use("/api/dashboard", isAuthenticated, dashboardRoute);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
