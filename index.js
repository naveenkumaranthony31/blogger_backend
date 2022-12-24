const express = require("express");
const app = express();
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const bcrypt = require("bcrypt");
const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");
const cors = require("cors");
const URL = process.env.DB;
const DB = "blogger";

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

let authenticateUser = function (request, response, next) {
  // console.log(request.headers);
  if (request.headers.authorization) {
    let token = jwt.sign(
      request.headers.authorization,
      process.env.SECRET 
    );
    console.log(token);
    if (token===token) {
      request.password = token.password;
      
      if (token) {
        next();
      } else {
        response.status(401).json({
          message: "Unauthorized",
        });
      }
    } 
  } else {
    response.status(401).json({
      message: "Unauthorized",
    });
  }
};

app.post("/register", async function (request, response) {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("blogger");
    const salt = await bcrypt.genSalt(10);
    console.log(salt);
    const hash = await bcrypt.hash(request.body.password, salt);
    request.body.password = hash;
    console.log(hash);
    await db.collection("users").insertOne(request.body);
    await connection.close();
    response.json({
      message: "User Registered!",
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/login", async function (request, response) {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db(DB);
    const user = await db
      .collection("users")
      .findOne({ email: request.body.email });
    if (user) {
      console.log(user);
      let compare = await bcrypt.compare(request.body.password, user.password);
      if (compare) {
        const token = jwt.sign({ _id: user._id }, process.env.SECRET, {
          expiresIn: "1d",
        });

        // process.URL.SECRET

        console.log(token);
        response.json({
          message: "logged in successfully",
          token,
          email: user.email,
        });
      } else {
        response.json({ message: "password is wrong" });
      }
    } else {
      response.status.json({ message: "your email is not found" });
    }
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "something went wrong" });
  }
});

app.get("/register/:id",async function (request, response) {
  try {
    const connection = await mongoClient.connect(URL);
    console.log(connection);
    const db = connection.db("blogger");  
    let user = await db.collection("users").findOne({_id:mongodb.ObjectId(request.params.id)},{$set:request.body});
    console.log(user);
    //   .find({ userid: mongodb.ObjectId(request.userid) })
    //   .toArray();
    await connection.close();
    response.json(user);
  } catch (error) {
    console.log(error);
  }
});

app.get("/cardget",authenticateUser,async function (request, response) {
  try {
    const connection = await mongoClient.connect(URL);
    console.log(connection);
    const db = connection.db("blogger");
    let blogs = await db.collection("blogs").find().toArray();
    console.log(blogs);
    //   .find({ userid: mongodb.ObjectId(request.userid) })
    //   .toArray();
    await connection.close();
    response.json(blogs);
  } catch (error) {
    console.log(error);
  }
});



app.get("/card",authenticateUser,async function (request, response) {
  try {
    const connection = await mongoClient.connect(URL);
    console.log(connection);
    const db = connection.db("blogger");
    let blogs = await db.collection("blogs").find().toArray();
    console.log(blogs);
    //   .find({ userid: mongodb.ObjectId(request.userid) })
    //   .toArray();
    await connection.close();
    response.json(blogs);
  } catch (error) {
    console.log(error);
  }
});

app.put("/card/:id", async function (request, response) {
  try {
    const connection = await mongoClient.connect(URL);
    console.log(connection);
    const db = connection.db("blogger");
    let blogs = await db.collection("blogs").findOneAndUpdate({_id:mongodb.ObjectId(request.params.id)},{$set:request.body});
    console.log(blogs);
    //   .find({ userid: mongodb.ObjectId(request.userid) })
    //   .toArray();
    await connection.close();
    response.json(blogs);
  } catch (error) {
    console.log(error);
  }
});

app.delete("/card/:id",authenticateUser, async function (request, response) {
  try {
    const connection = await mongoClient.connect(URL);
    console.log(connection);
    const db = connection.db("blogger");
    let blogs = await db.collection("blogs").deleteOne({ _id: mongodb.ObjectId(request.params.id) });
    console.log(blogs);
    //   .find({ userid: mongodb.ObjectId(request.userid) })
    //   .toArray();
    await connection.close();
    response.json(blogs);
  } catch (error) {
    console.log(error);
  }
});

app.post("/createblog",authenticateUser,async function (request, response) {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("blogger");
    let blogs = await db.collection("blogs").insertOne(request.body);
    console.log(blogs);
    //   .find({ userid: mongodb.ObjectId(request.userid) })
    //   .toArray();
    await connection.close();
    response.json(blogs);
  } catch (error) {
    console.log(error);
  }
});
//Port
app.listen(process.env.PORT || 3001);
