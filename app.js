const express = require("express");
const app = express();
const pdf = require("pdf-parse");
const fs = require("fs");
const multer = require("multer");
const User = require("./models/userModel");
let temp_buffer = "";
let index = 0;
var uname = "";
var pwd = "";
//-------------------------------------------------------------------------------------------
// MIDDLEWARES
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
//-------------------------------------------------------------------------------------------
// ROUTES

//GET THE HOME PAGE
app.get("/", (req, res) => {
  try {
    res.render("index");
  } catch (err) {
    console.log(err);
  }
});

//-------------------------------------------------------------------------------------------

// GET THE LOGIN PAGE
app.get("/login", (req, res) => {
  try {
    res.render("login");
  } catch (err) {
    console.log(err);
  }
});

//-------------------------------------------------------------------------------------------

// POST THE SIGNUP PAGE DETAILS
app.post("/user", async (req, res) => {
  try {
    const { name, dob, gender, username, password } = req.body;
    await User.create({
      name,
      dob,
      gender,
      username,
      password,
    });
    res.redirect("/login");
  } catch (err) {
    console.log(err);
  }
});

//-------------------------------------------------------------------------------------------

// VALIDATE THE USERNAME AND PASSWORD VIA LOGIN PAGE
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    uname = username;
    pwd = password;
    console.log(uname, pwd);
    const user = await User.findOne({ username });
    if (!user) {
      res.redirect("/login");
    } else {
      if (user.password === password) {
        res.redirect("/uploadFile");
      } else {
        res.redirect("/login");
      }
    }
  } catch (err) {
    console.log(err);
  }
});

//-------------------------------------------------------------------------------------------

// GET THE UPLOAD FILE PAGE
app.get("/uploadFile", (req, res) => {
  try {
    res.render("fileUpload");
  } catch (err) {
    console.log(err);
  }
});

//-------------------------------------------------------------------------------------------

// UPLOAD THE FILE TO THE SERVER
app.post("/uploadFile", (req, res) => {
  try {
    let dataBuffer = fs.readFileSync(__dirname + `/${req.body.file}`);
    temp_buffer = dataBuffer;
    pdf(dataBuffer).then(function (data) {
      User.findOne({ username: uname }, async (err, user) => {
        if (user) {
          user.files.push({
            name: req.body.file,
            file: data.text,
            idx: index,
          });
          await user.save();
          index++;
          res.redirect("/download");
        }
      });
      // console.group(data.text);
    });
  } catch (err) {
    console.log(err);
  }
});

//-------------------------------------------------------------------------------------------

// GET THE PARTICULAR USER TO UPLOAD DETAILS
app.get("/download", (req, res) => {
  try {
    User.findOne({ username: uname }, (err, user) => {
      if (err) {
        console.log(err);
      } else {
        let { name, dob, gender, files } = user;
        res.render("download", {
          user_name: name,
          birth: dob,
          user_gender: gender,
          file_data: files,
          idx: index,
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
});
//-------------------------------------------------------------------------------------------
// QUERY AND GET TO THE FILE'S CONTENT PAGE
app.get("/file_content/:id", async (req, res) => {
  try {
    const user = await User.findOne({ "files._id": req.params.id });
    let file;
    file = user.files.find((file) => file.id === req.params.id);
    // const linesArray = file.content.split('\n');
    // const lineCount = linesArray.length;
    res.render("final", { content: file.file });
  } catch (err) {
    console.log(err);
  }
});
module.exports = app;
//-------------------------------------------------------------------------------------------
