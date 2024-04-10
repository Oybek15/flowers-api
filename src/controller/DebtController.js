const prisma = require("../client/client");

module.exports.getAllDebts = function (req, res) {
  const page = parseInt(req?.query?.page || "0");
  const size = parseInt(req?.query?.size || "10");
  const date = req?.query?.date;
  prisma.debt
    .findMany({
      include: { product: true },
      skip: page * size,
      take: size,
      orderBy: [{ returned: "asc" }, { returnDate: "asc" }],
      ...(date
        ? {
            where: {
              returnDate: { gte: new Date(date + "T00:00:00.000Z"), lte: new Date(date + "T23:59:59.999Z") },
            },
          }
        : {}),
    })
    .then((data) => {
      prisma.debt
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

module.exports.getOneDebt = function (req, res) {
  const { id } = req.params;
  prisma.debt
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

module.exports.createDebt = function (req, res) {
  const { note, productPrice, debtSum, productId, returnDate, debtor, phone } = req.body;
  prisma.debt
    .create({
      data: {
        note,
        productPrice,
        debtSum,
        productId,
        returnDate,
        debtor,
        phone,
      },
    })
    .then((item) => {
      const avans = (productPrice || 0) - (debtSum || 0);
      if (avans > 0) {
        prisma.income
          .create({
            data: {
              type: "DEBT",
              note: "Qarzga sotildi. Avans to'lovi",
              price: avans,
              debtId: item.id,
              saleId: null,
              orderId: null,
            },
          })
          .catch((err) => console.log(err));
      }

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

module.exports.returnDebt = function (req, res) {
  const { id } = req.params;

  prisma.debt
    .update({
      where: { id: Number(id) },
      data: { returned: true },
    })
    .then((data) => {
      console.log(data);
      prisma.income
        .create({
          data: {
            type: "DEBT",
            price: data.debtSum,
            note: "Qarz To'landi",
            debtId: data.id,
            orderId: null,
            saleId: null,
          },
        })
        .catch((err) => console.log(err));

      res.status(200).send({
        success: true,
        data,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send({ error: err });
    });
};

module.exports.deleteDebt = function (req, res) {
  const { id } = req.params;

  try {
    prisma.income
      .findFirst({ where: { type: "DEBT", debtId: Number(id) } })
      .then((inc) => {
        prisma.income
          .delete({
            where: {
              id: inc.id,
            },
          })
          .then(() => {
            prisma.debt
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
