const prisma = require("../client/client");

module.exports.getAllOrders = function (req, res) {
  const page = parseInt(req?.query?.page || "0");
  const size = parseInt(req?.query?.size || "10");
  const date = req?.query?.date;
  prisma.order
    .findMany({
      include: { product: true },
      skip: page * size,
      take: size,
      orderBy: [{ done: "asc" }, { dateOfReceipt: "asc" }],
      ...(date
        ? {
            where: {
              dateOfReceipt: { gte: new Date(date + "T00:00:00.000Z"), lte: new Date(date + "T23:59:59.999Z") },
            },
          }
        : {}),
    })
    .then((data) => {
      prisma.order
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

module.exports.getLastOrders = function (req, res) {
  const size = parseInt(req?.query?.size || "10");
  prisma.order
    .findMany({
      include: { product: true },
      take: size,
      orderBy: { dateOfReceipt: "asc" },
      where: {
        done: false,
      },
    })
    .then((data) => {
      res.send({
        success: true,
        data,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send({ error: err });
    });
};

module.exports.getOneOrder = function (req, res) {
  const { id } = req.params;
  prisma.order
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

module.exports.createOrder = function (req, res) {
  const { note, price, avans, customer, phone, dateOfReceipt, productId } = req.body;
  prisma.order
    .create({
      data: {
        note,
        price,
        avans,
        customer,
        phone,
        dateOfReceipt,
        productId,
      },
    })
    .then((item) => {
      if (avans > 0) {
        prisma.income
          .create({
            data: {
              type: "AVANS",
              price: avans,
              note,
              orderId: item.id,
              saleId: null,
              debtId: null,
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

module.exports.transferToDone = function (req, res) {
  const { id } = req.params;

  prisma.order
    .update({
      where: { id: Number(id) },
      data: {
        done: true,
      },
    })
    .then((item) => {
      const diffPrice = (item?.price || 0) - (item?.avans || 0);
      if (diffPrice > 0) {
        prisma.income
          .create({
            data: {
              type: "ORDER_FINISH",
              price: diffPrice,
              note: item.note,
              orderId: Number(id),
              saleId: null,
              debtId: null,
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

module.exports.deleteOrder = function (req, res) {
  const { id } = req.params;
  try {
    prisma.income
      .findFirst({ where: { type: "AVANS", orderId: Number(id) } })
      .then((inc) => {
        prisma.income
          .delete({
            where: {
              id: inc.id,
            },
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

    prisma.income
      .findFirst({ where: { type: "ORDER_FINISH", orderId: Number(id) } })
      .then((inc) => {
        prisma.income
          .delete({
            where: {
              id: inc.id,
            },
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

  prisma.order
    .delete({ where: { id: Number(id) } })
    .then(() => res.status(200).send({ success: true }))
    .catch((err) => {
      console.log(err);
      res.status(400).send({ error: err });
    });
};
