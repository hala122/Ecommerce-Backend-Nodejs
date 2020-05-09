const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const User = require("../models/user");
const Product = require("../models/product");
const authenticationMiddleware = require("../middlewares/authentication");

////////////////////////////////////////////////////Register/////////////////////
// router.post("/register", async (req, res, next) => {
//   try {
//     const { userName, email, password } = req.body;
//     const user = await new User({
//       username,
//       password,
//       fullname
//     });
//     user.save();
//     res.json(user);
//   } catch (err) {
//     console.error(err);
//     next(err);
//   }
// });
router.post("/", (req, res, next) => {
  const { userName, email, password } = req.body;
  const user = new User({ userName, email, password });
  user.save(err => {
    if (err) return next(createError(400, err));
    debugger;
    res.send(user);
  });
});

//////////////////////////////////////////Get Users//////////////////////////////////////

router.get("/", (req, res, next) => {
  User.find({}, function(err, users) {
    if (err) return next(createError(400, err));
    res.send(users);
  });
});
/////////////////////////////////////////////////////////Login////////////////////
router.post("/login", async (req, res, next) => {
  const { userName, password } = req.body;
  if (!userName || !password) return next(createError(400, "Missing Data"));
  const user = await User.findOne({ userName });
  if (!user) return next(createError(401));
  const isMatch = await user.verifyPassword(password).catch(console.error);
  if (!isMatch) return next(createError(401));
  const token = await user.generateToken();
  res.send({ token, user });
});
//////////////////////////////////////////////////Get User By Id////////////////////////

router.get("/:userId", (req, res, next) => {
  Product.find({ userId: req.params.userId }, function(err, products) {
    if (err) return next(createError(400, err));
    res.send(products);
  });
});

router.use(authenticationMiddleware);

router.get("/profile", (req, res, next) => {
  res.send(req.user);
});

module.exports = router;
// router.post("/login", async (req, res, next) => {
//   try {
//      const { id } = req.params;
//     const user = await User.findOne({ username, password }).populate("posts");
//     res.json(user);
//   } catch (err) {
//     console.error(err);
//     next(err);
//   }
// });
