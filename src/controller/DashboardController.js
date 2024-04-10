const prisma = require("../client/client");

module.exports.getTodayOrdersProccess = function (req, res) {
  // prisma.order
  //   .findMany({})
  //   .then((data) => {
  //     res.send({
  //       success: true,
  //       data,
  //     });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     res.status(400).send({ error: err });
  //   });
  res.send({
    success: true,
    data: {
      total: 4,
      complated: 3
    }
  })
};

module.exports.getDashboardIncomes = function (req, res) {
  const date = req.query?.date;
  prisma.income
    .findMany({
      where: {
        createdAt: { gte: new Date(date+"-01"), lte: new Date(date + "-31") },
      },
    })
    .then((result) => {
      const data = {};

      result?.forEach((item) => {
        const d = item?.createdAt?.toLocaleString()?.slice(0, 10);
        if(data.hasOwnProperty(d)) {
          data[d] = data[d] + (item?.price || 0);
        } else {
          data[d] = item?.price || 0;
        }
      });

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

module.exports.getDashboardSpends = function (req, res) {
  const date = req.query?.date;
  prisma.spend
    .findMany({
      where: {
        createdAt: { gte: new Date(date+"-01"), lte: new Date(date + "-31") },
      },
    })
    .then((result) => {
      const data = {};

      result?.forEach((item) => {
        const d = item?.createdAt?.toLocaleString()?.slice(0, 10);
        if(data.hasOwnProperty(d)) {
          data[d] = data[d] + (item?.price || 0);
        } else {
          data[d] = item?.price || 0;
        }
      });

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
