const express = require("express");
const app = express();
const cors = require("cors")
const User = require("./model/user")
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
require("dotenv").config();
// const jwt = require("jsonwebtoken");
app.use(express.json());
app.use(cookieParser());
app.use(cors(
  {
    origin:"http://localhost:5173",
    credentials:true,
  }
));
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const sendConnectionRequest = require("./routes/requests");
const requestRouter = require("./routes/requests");
const { userAuth } = require("./middlewares/auth");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/",userRouter);


// // app.get("/admin/data", (req, res) => {
// //   res.send({ name: "Mohit kumar", Age: 20 });
// // });

// // app.get("/user", (req, res) => {
// //   res.send("hello user is here");
// // });

// // app.get("/user/data", (req, res) => {
// //   res.send({ name: "user", data: "data" });
// // });

// // app.get("/getUserData", (req, res) => {
// //   throw new Error("fghsgs");
// //   res.send("user data send");
// // });

// // app.use("/", (err, req, res, next) => {
// //   if (err) {
// //     res.status(501).send("something went wrong");
// //   }
// // });

// //get user by emailId
//feed
app.get("/feed",userAuth, async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(404).send("something went wrong");
    console.log(err);
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const users = await User.findByIdAndDelete(userId);
    res.send("user deleted succesfully");
  } catch (err) {
    {
      res.status(404).send("something went wrong");
    }
  }
});

//update
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const Allowed_Updates = ["skills", "about", "age", "gender"];
    const isUpdateAllowed = Object.keys(data).every((key) =>
      Allowed_Updates.includes(key)
    );

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed for one or more fields");
    }

    const user = await User.findByIdAndUpdate(userId, data, {
      //new: true, // Return the updated document
      returnDocument: "after",
      runValidators: true, // Ensure validation rules are applied
    });

    // if (!user) {
    //   return res.status(404).send("User not found");
    // }

    // res.status(200).send({ message: "User updated successfully", user });
    res.send(user);
  } catch (err) {
    res.status(400).send("Update failed: " + err.message);
  }
});

//PROFILE

connectDB()
  .then(() => {
    console.log("Database connected successfully");

    app.listen(process.env.PORT, () => {
      console.log("server started on server 3000");
    });
  })

  .catch((err) => {
    console.log("Database not connected");
  });
