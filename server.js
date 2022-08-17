const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");

//Configuring dotenv
dotenv.config();
const port = process.env.PORT;

//CONNECTING TO DATABASE
connectDatabase();

//STARTING SERVER
app.listen(port, () => {
  console.log(`Listening to server ${port}`);
  var today = new Date();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  console.log(time);
});
