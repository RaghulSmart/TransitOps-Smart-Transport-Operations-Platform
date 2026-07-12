const db = require("../config/db");

exports.index = async (req, res) => {

    const [drivers] = await db.query(
        "SELECT * FROM drivers ORDER BY id DESC"
    );
    const driver_status = [
        {
            value : "available",
            text  : "Available" 
        },
        {
            value : "off_duty",
            text  : "Off Duty" 
        },
        {
            value : "suspended",
            text  : "Suspended" 
        }
    ];
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
    res.render("drivers/index", {
        drivers,
        driver_status,
        display_driver_status,
        user: req.session.user,
        footer_scripts:"<script src='/js/drivers.js'></script>"
    });

};

exports.save = async (req, res) => {

    try {

        const {
            name,
            license_number,
            license_category,
            license_expiry,
            phone,
            safety_score,
            status
        } = req.body;

        const [exists] = await db.query(
            "SELECT license_number FROM drivers WHERE license_number=?",
            [license_number]
        );

        if (exists.length) {

            return res.json({
                status:false,
                message:"License Number already exists."
            });

        }

        await db.query(

            `INSERT INTO drivers
            (
                name,
                license_number,
                license_category,
                license_expiry,
                phone,
                safety_score,
                status
            )

            VALUES (?,?,?,?,?,?,?)`,

            [
                name,
                license_number,
                license_category,
                license_expiry,
                phone,
                safety_score,
                status
            ]

        );

        res.json({

            status:true,

            message:"Driver Added Successfully"

        });

    } catch(err){

        console.log(err);

        res.json({

            status:false,

            message:"Something went wrong."

        });

    }

};