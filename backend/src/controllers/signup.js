const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const prisma = require("../prisma_client/prisma_client");
const CustomError = require("../functions/customError");

//SIGN UP
const validateSignUp = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username cannot be empty")
    .matches(/^[a-z0-9_.-]{4,16}$/)
    .withMessage(
      `Username has to be between 4 and 16 characters long and only include lowercase, numbers and _ . or -`
    )
    .custom(async (username) => {
      const user = await prisma.user.findUnique({
        where: {
          username: username,
        },
      });
      if (user) {
        throw new Error("Username already in use");
      }
    }),
  body("password")
    .trim()
    .notEmpty()
    .withMessage(`Password cannot be empty`)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.!@#$%^&*()_+])[A-Za-z\d.!@#$%^&*()_+]{8,25}$/
    )
    .withMessage(
      "Password must be between 8 and 25 characters long and include uppercase, lowercase, number, and special character"
    ),
  body("confirmPassword")
    .trim()
    .notEmpty()
    .withMessage(`Confirmation password cannot be empty`)
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return value === req.body.password;
    }),
];

module.exports.signup = [
  validateSignUp,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        username: username,
        password: hashedPassword,
      },
    });
    res.status(200).json({ message: "signup successful" });
  },
  ,
];
