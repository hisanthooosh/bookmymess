const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {

    res.send("BookMyMess API Running 🚀");

});

app.use(
    "/api/auth",
    require("./routes/authRoutes")
);

app.use(
    "/api/mess",
    require("./routes/messRoutes")
);

app.use(
    "/api/owner",
    require("./routes/ownerRoutes")
);

app.use(
    "/api/menu",
    require("./routes/menuRoutes")
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(`Server Running on ${PORT}`);

});