const prisma = require("../client/client");

module.exports.getAllSpends = function (req, res) {
  const page = parseInt(req?.query?.page || "0");
  const size = parseInt(req?.query?.size || "10");
  prisma.spend
    .findMany({ include: { spendType: true }, skip: page * size, take: size, orderBy: { createdAt: "desc" } })
    .then((data) => {
      prisma.spend
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

module.exports.createSpend = function (req, res) {
  const { price, note, spendTypeId } = req.body;
  prisma.spend
    .create({
      data: {
        spendTypeId,
        note,
        price,
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

module.exports.deleteSpend = function (req, res) {
  const { id } = req.params;
  prisma.spend
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
