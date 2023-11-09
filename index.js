const express = require("express");
const mongoose = require("mongoose");
const userModel = require("./models/userModel.js");
const activityModel = require("./models/activityModel.js");

const cors = require("cors");
const bodyParser = require("body-parser");
const registerController = require("./controllers/registerController.js");
const loginController = require("./controllers/loginController.js");
const activityPostController = require("./controllers/activityPostController.js");

const app = express();
app.use(bodyParser.json());

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

const PORT = process.env.PORT || 4000;

app.use(cors(corsOptions));

// Connect to MongoDB Atlas
const mongoURI = "mongodb+srv://navaneethv:naveevenkatIT@cluster0.t37qosu.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

db.once("open", () => {
  console.log("Connected to MongoDB Atlas");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

app.post("/register", registerController);
app.post("/login", loginController);

app.get("/get", (req, res) => {
  userModel.find({})
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});

app.get("/get/:id", (req, res) => {
  userModel.findById(req.params.id)
    .then(getData => {
      res.send(getData);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});

app.post("/activitypost", activityPostController);

app.get("/activityget", (req, res) => {
  activityModel.find({})
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});

app.get("/activityget/:id", (req, res) => {
  activityModel.findById(req.params.id)
    .then(getActivityData => {
      res.send(getActivityData);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});

app.delete("/activityget/:id", (req, res) => {
  activityModel.findByIdAndRemove(req.params.id)
    .then(deleteActivityData => {
      res.send(deleteActivityData);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});

app.put("/activityedit/:id", (req, res) => {
  activityModel.findByIdAndUpdate(req.params.id, { $set: req.body })
    .then(() => {
      return activityModel.findById(req.params.id);
    })
    .then(idGet => {
      res.send(idGet);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});
