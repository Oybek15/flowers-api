const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
  const { authorization } = req.headers;

  if (req.url?.startsWith("/api/auth")) {
    next();
  }

  if (!authorization) {
    res.status(401).send({ error: true, message: "Un-Authorized" });
  }

  try {
    const token = authorization.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.payload = payload;
  } catch (err) {
    res.status(401);
    if (err.name === "TokenExpiredError") {
      res.status(401).send({ error: true, message: err.name || "Un-Authorized" });
    }
    res.status(401).send({ error: true, message: "Un-Authorized" });
  }

  return next();
};

const requestLogger = (request, response, next) => {
  console.log(`${request.method} url:: ${request.url}`);
  next();
};

module.exports = {
  isAuthenticated,
  requestLogger,
};
