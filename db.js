const mongoose = require("mongoose");

const connectionurl =
  "mongodb+srv://Hala:Hala122@cluster0-rgjxy.mongodb.net/Ecommerce?retryWrites=true&w=majority";

mongoose.connect(connectionurl, {
  useNewUrlParser: true,
  useCreateIndex: true
});
