const db = require("../config/db");
const bcrypt = require("bcrypt");

// Login Page
exports.loginPage = async (req, res) => {

    try {
        if (req.session.user) {
            return res.redirect("/dashboard");
        }
        res.render("layouts/auth", {
            layout : false,
            title: "Login"
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }

};

// Login
exports.login = async (req, res) => {

    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({
                status: false,
                message: "Email and Password are required."
            });
        }

        const [users] = await db.query(
            `SELECT u.name,u.email,r.name role,u.password
             FROM users u, roles r
             WHERE email = ?
             AND status='active' AND r.id = u.role_id
             LIMIT 1`,
            [email]
        );

        if (users.length === 0) {
            return res.json({
                status: false,
                message: "Invalid Email or Password."
            });
        }

        const user = users[0];
        const matched = await bcrypt.compare(
            password,
            user.password
        );

        if (!matched) {
            return res.json({
                status: false,
                message: "Invalid Email or Password."
            });
        }

        req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        return res.json({
            status: true,
            message: "Login Successful.",
            redirect: "/dashboard"
        });

    } catch (err) {
        console.log(err);
        return res.json({
            status: false,
            message: "Something went wrong."
        });
    }

};

// Dashboard
exports.dashboard = async (req, res) => {
    const [vehicles] = await db.query(
        "SELECT status, count(status) overview FROM vehicles GROUP BY status"
    );
    const [drivers] = await db.query(
        "SELECT status, count(status) overview FROM drivers GROUP BY status"
    );
    const [trips] = await db.query(
        "SELECT status, count(status) overview FROM trips GROUP BY status"
    );
    const display_vehicle_status = {
        "available" : {
            "class" : "success",
            "text" : "Available"
        },
        "retired" : {
            "class" : "danger",
            "text" : "Retired"
        },
        "in_shop" : {
            "class" : "info",
            "text" : "In Shop"
        },
        "on_trip" : {
            "class" : "warning",
            "text" : "On Trip"
        }
    };
    const display_driver_status = {
        "available" : {
            "class" : "success",
            "text" : "Available"
        },
        "suspended" : {
            "class" : "danger",
            "text" : "Suspended"
        },
        "off_duty" : {
            "class" : "info",
            "text" : "Off Duty"
        },
        "on_trip" : {
            "class" : "warning",
            "text" : "On Trip"
        }
    };
    const display_trip_status = {
        "dispatched" : {
            "class" : "info",
            "text" : "Dispatched"
        },
        "cancelled" : {
            "class" : "danger",
            "text" : "Cancelled"
        },
        "completed" : {
            "class" : "success",
            "text" : "Completed"
        }
    };
    try {
        res.render("dashboard/index", {
            display_vehicle_status,
            display_driver_status,
            display_trip_status,
            drivers,
            vehicles,
            trips,
            user: req.session.user
        });
    } catch (err) {
        console.log(err);
        res.redirect("/login");
    }
};

// Logout
exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
};