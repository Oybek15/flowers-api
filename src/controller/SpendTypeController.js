const prisma = require("../client/client");

module.exports.getAllSpendTypes = function (req, res) {
  const page = parseInt(req?.query?.page || "0");
  const size = parseInt(req?.query?.size || "10");
  prisma.spendType
    .findMany({ skip: page * size, take: size, orderBy: { createdAt: "desc" } })
    .then((data) => {
      prisma.spendType
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

module.exports.getOneSpendType = function (req, res) {
  const { id } = req.params;
  prisma.spendType
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

module.exports.createSpendType = function (req, res) {
  const { name } = req.body;
  prisma.spendType
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

module.exports.updateSpendType = function (req, res) {
  const { id } = req.params;
  const { name } = req.body;
  prisma.spendType
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

module.exports.deleteSpendType = function (req, res) {
  const { id } = req.params;
  prisma.spendType
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
