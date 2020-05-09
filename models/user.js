require("mongoose-type-email");
const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const secretKey = "mySecretKey";
const saltRounds = 10;

const sign = (...args) => {
  return new Promise((resolve, reject) => {
    jwt.sign(...args, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const verify = (...args) => {
  return new Promise((resolve, reject) => {
    jwt.verify(...args, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const schema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true
    },
    email: {
      type: mongoose.SchemaTypes.Email,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    products: {
      type: Array
    }
  },
  {
    toJSON: {
      hide: "password",
      transform: true
    },
    autoIndex: true
  }
);

schema.options.toJSON.transform = function(doc, ret, options) {
  if (options.hide) {
    options.hide.split(" ").forEach(prop => {
      delete ret[prop];
    });
  }
  return ret;
};

const hashPassword = password => bcrypt.hash(password, saltRounds);

schema.pre("save", async function() {
  const user = this;
  if (user.isNew || user.modifiedPaths().includes("password")) {
    user.password = await hashPassword(user.password);
  }
});

schema.method("generateToken", async function() {
  const user = this;
  const token = await sign({ _id: user.id }, secretKey, { expiresIn: "5m" });
  return token;
});

schema.method("verifyPassword", function(comparedPassword) {
  return bcrypt.compare(comparedPassword, this.password);
});

schema.static("decodeToken", function(token) {
  return verify(token, secretKey);
});
const User = mongoose.model("User", schema);

module.exports = User;
