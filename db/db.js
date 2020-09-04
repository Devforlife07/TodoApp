const mongooose = require("mongoose");

const connectDB = async () => {
  mongooose
    .connect(process.env.MONGO_URI, {
      useCreateIndex: true,
      useFindAndModify: true,
      useNewUrlParser: true,
    })
    .then(() => console.log("DB Connected"))
    .catch((e) => {
      console.log("Can't Connect To DB");
    });
};
module.exports = connectDB;
