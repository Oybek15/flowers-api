const prisma = require("../client/client");

module.exports.getAllIncomes = function (req, res) {
  const page = parseInt(req?.query?.page || "0");
  const size = parseInt(req?.query?.size || "10");
  const date = req?.query?.date;
  prisma.income
    .findMany({
      include: { order: true, debt: true, sale: true },
      skip: page * size,
      take: size,
      orderBy: { createdAt: "desc" },
      ...(date
        ? {
            where: {
              createdAt: { gte: new Date(date + "T00:00:00.000Z"), lte: new Date(date + "T23:59:59.999Z") },
            },
          }
        : {}),
    })
    .then((data) => {
      prisma.income
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

module.exports.createIncome = function (req, res) {
  const { note, type, price, orderId, debtId } = req.body;
  prisma.income
    .create({
      data: {
        note,
        type,
        price,
        orderId,
        saleId,
        debtId,
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
