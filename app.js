require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");
const methodOverride = require("method-override");

const app = express();


// Config
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(methodOverride("_method"));

app.use(
    express.static(path.join(__dirname, "public"))
);

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 8 // 8 Hours
        }
    })
);

// Global Variables
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});


// Routes
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const vehicleRoutes = require("./routes/vehicles");
const driverRoutes = require("./routes/drivers");
const tripRoutes = require("./routes/trips");
const maintenanceRoutes = require("./routes/maintenance");
const fuelRoutes = require("./routes/fuel");
const reportRoutes = require("./routes/reports");

app.use(authRoutes);

app.use("/dashboard", dashboardRoutes);

app.use("/vehicles", vehicleRoutes);

app.use("/drivers", driverRoutes);

app.use("/trips", tripRoutes);

app.use("/maintenance", maintenanceRoutes);

app.use("/fuel", fuelRoutes);

app.use("/reports", reportRoutes);

// app.use((req, res) => {

//     res.status(404).render("404", {

//         title: "404"

//     });

// });

//Project Start
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Odoo Hackathon - 2026 - TransitOps Started http://localhost:${PORT}`);
});