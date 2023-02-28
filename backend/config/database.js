const mongoose = require("mongoose");

exports.connectDatabase = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then((con) => {
       (`Database Connected at ${con.connection.host}`);
    })
    .catch((err) =>  (err));
};
