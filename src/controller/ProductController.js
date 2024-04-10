const prisma = require("../client/client");

module.exports.getAllProducts = function (req, res) {
  const page = parseInt(req?.query?.page || "0");
  const size = parseInt(req?.query?.size || "10");
  prisma.product
    .findMany({ include: { productType: true }, skip: page * size, take: size, orderBy: { createdAt: "desc" } })
    .then((data) => {
      prisma.product
        .count()
        .then((total) => {
          res.send({
            success: true,
            data,
            total,
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(400).send({ error: err });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send({ error: err });
    });
};

module.exports.getOneProduct = function (req, res) {
  const { id } = req.params;
  prisma.product
    .findUnique({ where: { id: Number(id) } })
    .then((item) => {
      res.send({
        success: true,
        data: item,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send({ error: err });
    });
};

module.exports.createProduct = function (req, res) {
  const { name, productTypeId } = req.body;
  prisma.product
    .create({
      data: {
        name,
        productTypeId,
      },
    })
    .then((item) => {
      res.send({
        success: true,
        data: item,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send({ error: err });
    });
};

module.exports.updateProduct = function (req, res) {
  const { id } = req.params;
  const { name, productTypeId } = req.body;
  prisma.product
    .update({
      where: { id: Number(id) },
      data: {
        name,
        productTypeId,
      },
    })
    .then((item) => {
      res.send({
        success: true,
        data: item,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send({ error: err });
    });
};

module.exports.deleteProduct = function (req, res) {
  const { id } = req.params;
  prisma.product
    .delete({
      where: { id: Number(id) },
    })
    .then((item) => {
      res.send({
        success: true,
        data: item,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send({ error: err });
    });
};
