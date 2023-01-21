const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware.js");

router.post("/signup", async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res
      .status(400)
      .json({ message: "Todos los campos deben ser rellenados" });
    return;
  }

  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
  if (!passwordRegex.test(password)) {
    res
      .status(400)
      .json({
        message:
          "La contraseña debe tener al menos 8 letras, una mayúscula y un número",
      });
    return;
  }
console.log(username)
  try {
    const foundUser = await User.findOne({ username });
    console.log(foundUser)
    if (foundUser) {
      res
        .status(400)
        .json({ message: "El usuario ya ha sido previamente registrado" });
      return;
    }

    // Password Encrypting
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = {
      username,
      password: hashPassword,
    };

    await User.create(newUser);

    res.status(201).json("Usuario registrado correctamente");
  } catch (error) {
    next(error);
  }
});

router.post("/login", (req, res, next) => {
  const { username, password, role } = req.body;

  if (username === "" || password === "") {
    res.status(400).json({ message: "Rellene los campos de usuario o contraseña." });
    return;
  }

  User.findOne({ username })
    .then((foundUser) => {
      if (!foundUser) {
        res.status(401).json({ message: "Usuario no registrado." });
        return;
      }

      const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

      if (passwordCorrect) {
        const { _id, username } = foundUser;

        const payload = { _id, username, role };

        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "3h",
        });

        res.status(200).json({ authToken: authToken });
      } else {
        res.status(401).json({ message: "No se ha podido autenticar al usuario" });
      }
    })
    .catch((err) => next(err));
});

router.get("/verify", isAuthenticated, (req, res, next) => {
  res.status(200).json(req.payload);
});

module.exports = router;