const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = require("../client/client");

const findUserByEmail = (email) => {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
};

const createUserByEmailAndPassword = (user) => {
  user.password = bcrypt.hashSync(user.password, 12);
  return prisma.user.create({
    data: user,
  });
};

const findUserById = (id) => {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
};

const getCurrentUser = async (req, res) => {
  if (req.headers && req.headers?.authorization) {
    const authorization = req.headers?.authorization?.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(authorization, process.env.JWT_ACCESS_SECRET);
      if (!decoded) {
        res.status(400).send({ message: "info error by token" });
      }

      const user = await findUserById(decoded.userId || "");
      if (!user) {
        res.status(400).send({ message: "get user err by id" });
      } else {
        res.send({
          data: user,
        });
      }
    } catch (e) {
      console.log(e);
      res.status(400).send({ message: "get user info error", error: e });
    }
  } else {
    res.status(400).send({ message: "request headers token not found" });
  }
};

const getAllUsers = (req, res) => {
  const page = parseInt(req?.query?.page || "0");
  const size = parseInt(req?.query?.size || "10");
  prisma.user
    .findMany({ skip: page * size, take: size })
    .then((data) => {
      prisma.user
        .count()
        .then((total) => {
          res.send({
            success: true,
            data,
            total,
          });
        })
        .catch((er) => {
          res.status(400).send({ error: er });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send({ error: err });
    });
};

const deleteUser = function (req, res) {
  const { id } = req.params;
  prisma.user
    .delete({
      where: { id },
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

module.exports = {
  findUserByEmail,
  findUserById,
  createUserByEmailAndPassword,
  getAllUsers,
  deleteUser,
  getCurrentUser,
};
