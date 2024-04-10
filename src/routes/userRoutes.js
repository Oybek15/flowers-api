const router = require("express").Router();
const { v4: uuidv4 } = require("uuid");

const { generateTokens } = require("../jwt/jwt");
const { addRefreshTokenToWhitelist } = require("../controller/AuthController");
const { findUserByEmail, createUserByEmailAndPassword, getAllUsers, deleteUser, getCurrentUser } = require("../controller/UserController");

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).send({ error: true, message: "You must provide an email and a password." });
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      res.status(400).send({ error: true, message: "Email already in use." });
    }

    const user = await createUserByEmailAndPassword({ email, password });
    const jti = uuidv4();
    const { accessToken, refreshToken } = generateTokens(user, jti);
    await addRefreshTokenToWhitelist({ jti, refreshToken, userId: user.id });

    res.status(200).send({
      accessToken,
      refreshToken
    });
  } catch (err) {
    res.status(500).send({ error: true, message: err || "register error" })
  }
});

router.get('/', getAllUsers);
router.get('/current', getCurrentUser);
router.delete("/delete/:id", deleteUser);

module.exports = router;
