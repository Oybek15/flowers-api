const prisma = require("../client/client");

module.exports.getAllSales = function (req, res) {
  const page = parseInt(req?.query?.page || "0");
  const size = parseInt(req?.query?.size || "10");
  const date = req?.query?.date;
  prisma.sale
    .findMany({
      include: { product: true },
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
      prisma.sale
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

module.exports.getOneSale = function (req, res) {
  const { id } = req.params;
  prisma.sale
    .findUnique({ where: { id: Number(id) }, include: { product: true } })
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

module.exports.createSale = function (req, res) {
  const { note, price, productId } = req.body;
  prisma.sale
    .create({
      data: {
        note,
        price,
        productId,
      },
    })
    .then((item) => {
      prisma.income
        .create({
          data: {
            type: "SALE",
            price,
            note,
            orderId: null,
            saleId: item.id,
            debtId: null,
          },
        })
        .catch((err) => console.log(err));

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

module.exports.updateSale = function (req, res) {
  const { id } = req.params;
  const { note, price, productId } = req.body;
  prisma.sale
    .update({
      where: { id: Number(id) },
      data: {
        note,
        price,
        productId,
      },
    })
    .then((item) => {
      prisma.income
        .findFirst({
          where: { saleId: Number(id), type: "SALE" },
        })
        .then((inc) => {
          prisma.income.update({ where: { id: inc.id }, data: { price, note } }).catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));

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

module.exports.deleteSale = function (req, res) {
  const { id } = req.params;

  try {
    prisma.income
      .findFirst({ where: { type: "SALE", saleId: Number(id) } })
      .then((inc) => {
        prisma.income
          .delete({
            where: {
              id: inc.id,
            },
          })
          .then(() => {
            prisma.sale
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
  } catch (err) {
    res.status(400).send({ err });
  }
};
