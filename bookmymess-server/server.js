const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const connectDB = require("./config/db");

connectDB();

const app = express();

// Middleware
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://localhost:3000"
        ],
        credentials: true
    })
);

app.use(express.json());

// Routes
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
    "/api/student",
    require("./routes/studentRoutes")
);

app.use(
    "/api/menu",
    require("./routes/menuRoutes")
);

app.use(
    "/api/booking",
    require("./routes/bookingRoutes")
);

app.use(
    "/api/extra-item",
    require("./routes/extraItemRoutes")
);

app.use(
    "/api/subscription",
    require("./routes/subscriptionRoutes")
);

// Health Check
app.get("/", (req, res) => {

    res.send(
        "BookMyMess API Running 🚀"
    );

});

const PORT =
    process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(
        `Server Running on ${PORT}`
    );

});