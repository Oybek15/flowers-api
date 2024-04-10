const prisma = require("../client/client");

module.exports.getAllProductTypes = function (req, res) {
  const page = parseInt(req?.query?.page || "0");
  const size = parseInt(req?.query?.size || "10");
  prisma.productType
    .findMany({ skip: page * size, take: size, orderBy: { createdAt: "desc" } })
    .then((data) => {
      prisma.productType
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

module.exports.getOneProductType = function (req, res) {
  const { id } = req.params;
  prisma.productType
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

module.exports.createProductType = function (req, res) {
  const { name } = req.body;
  prisma.productType
    .create({
      data: {
        name,
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

module.exports.updateProductType = function (req, res) {
  const { id } = req.params;
  const { name } = req.body;
  prisma.productType
    .update({
      where: { id: Number(id) },
      data: {
        name,
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

module.exports.deleteProductType = function (req, res) {
  const { id } = req.params;
  prisma.productType
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
