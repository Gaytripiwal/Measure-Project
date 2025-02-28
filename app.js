if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
 
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// **MongoDB Connection**
async function main() {
  await mongoose.connect(MONGO_URL);
}
main()
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

app.set("view engine", "ejs");

//  **Check Views Folder Path**
console.log("🔹 Views Folder Path:", path.join(__dirname, "views"));
app.set("views", path.join(__dirname, "views")); 

app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// **Check Public Folder Path**
console.log("🔹 Public Folder Path:", path.join(__dirname, "public"));
app.use(express.static(path.join(__dirname, "public"))); 

const sessionOption = {
  secret: process.env.SECRET || "mysecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

//  **Routes**
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!!!"));
});

//  **Fixed Error Handler Path (Changed to "users/error")**
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("users/error", { message }); //  Corrected Path
});

app.listen(8080, () => {
  console.log("🚀 Server is running on http://localhost:8080");
});


// if (process.env.NODE_ENV !== "production") {
//   require("dotenv").config();
// }
 
// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const path = require("path");
// const methodOverride = require("method-override");
// const ejsMate = require("ejs-mate");
// const ExpressError = require("./utils/ExpressError.js");
// const session = require("express-session");
// const flash = require("connect-flash");
// const passport = require("passport");
// const localStrategy = require("passport-local");
// const User = require("./models/user.js");

// const listingsRouter = require("./routes/listing.js");
// const reviewsRouter = require("./routes/review.js");
// const userRouter = require("./routes/user.js");


// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// // **MongoDB Connection**
// async function main() {
//   await mongoose.connect(MONGO_URL);
// }
// main()
//   .then(() => console.log("✅ Connected to MongoDB"))
//   .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// app.set("view engine", "ejs");

// //  **Check Views Folder Path**
// console.log("🔹 Views Folder Path:", path.join(__dirname, "views"));
// app.set("views", path.join(__dirname, "views")); 

// app.engine("ejs", ejsMate);
// app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride("_method"));

// // **Check Public Folder Path**
// console.log("🔹 Public Folder Path:", path.join(__dirname, "public"));
// app.use(express.static(path.join(__dirname, "public"))); 

// const sessionOption = {
//   secret: process.env.SECRET || "mysecret",
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//     expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
//     maxAge: 7 * 24 * 60 * 60 * 1000,
//     httpOnly: true,
//   },
// };

// app.use(session(sessionOption));
// app.use(flash());

// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new localStrategy(User.authenticate()));

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// app.use((req, res, next) => {
//   res.locals.success = req.flash("success");
//   res.locals.error = req.flash("error");
//   res.locals.currUser = req.user;
//   next();
// });

// //  **Routes**
// app.use("/listings", listingsRouter);
// app.use("/listings/:id/reviews", reviewsRouter);
// app.use("/", userRouter);

// app.all("*", (req, res, next) => {
//   next(new ExpressError(404, "Page Not Found!!!"));
// });

// //  **Fixed Error Handler Path (Changed to "users/error")**
// app.use((err, req, res, next) => {
//   let { statusCode = 500, message = "Something went wrong" } = err;
//   res.status(statusCode).render("users/error", { message }); //  Corrected Path
// });

// app.listen(8080, () => {
//   console.log("🚀 Server is running on http://localhost:8080");
// });