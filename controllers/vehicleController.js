const db = require("../config/db");

exports.index = async (req, res) => {

    const [vehicles] = await db.query(
        "SELECT * FROM vehicles ORDER BY id DESC"
    );

    const [vehicle_models] = await db.query(
        "SELECT * FROM vehicle_models ORDER BY id ASC"
    );

    const [vehicle_types] = await db.query(
        "SELECT * FROM vehicle_types ORDER BY id ASC"
    );
    const vehicle_status = [
        {
            value : "available",
            text  : "Available" 
        },
        {
            value : "retired",
            text  : "Retired" 
        }
    ];
    res.render("vehicles/index", {
        vehicles,
        vehicle_models,
        vehicle_types,
        vehicle_status,
        user: req.session.user,
        footer_scripts:"<script src='/js/vehicle.js'></script>"
    });

};

exports.save = async (req, res) => {

    try {

        const {
            registration_no,
            vehicle_model,
            vehicle_type,
            max_load_capacity,
            odometer,
            acquisition_cost,
            status
        } = req.body;

        const [exists] = await db.query(
            "SELECT id FROM vehicles WHERE registration_no=?",
            [registration_no]
        );

        if (exists.length) {

            return res.json({
                status:false,
                message:"Registration already exists."
            });

        }

        await db.query(

            `INSERT INTO vehicles
            (
                registration_no,
                vehicle_model_id,
                vehicle_type_id,
                max_load_capacity,
                odometer,
                acquisition_cost,
                status
            )

            VALUES (?,?,?,?,?,?,?)`,

            [
                registration_no,
                vehicle_model,
                vehicle_type,
                max_load_capacity,
                odometer,
                acquisition_cost,
                status
            ]

        );

        res.json({

            status:true,

            message:"Vehicle Added Successfully"

        });

    } catch(err){

        console.log(err);

        res.json({

            status:false,

            message:"Something went wrong."

        });

    }

};

exports.getVehicle = async(req,res)=>{

    const [vehicle]=await db.query(

        "SELECT * FROM vehicles WHERE id=?",

        [req.params.id]

    );

    res.json(vehicle[0]);

};

exports.update=async(req,res)=>{

    const {

        registration_no,
        vehicle_name,
        vehicle_type,
        max_load_capacity,
        odometer,
        acquisition_cost,
        status

    }=req.body;

    await db.query(

        `UPDATE vehicles

        SET

        registration_no=?,

        vehicle_name=?,

        vehicle_type=?,

        max_load_capacity=?,

        odometer=?,

        acquisition_cost=?,

        status=?

        WHERE id=?`,

        [

            registration_no,

            vehicle_name,

            vehicle_type,

            max_load_capacity,

            odometer,

            acquisition_cost,

            status,

            req.params.id

        ]

    );

    res.json({

        status:true,

        message:"Vehicle Updated"

    });

};

exports.delete=async(req,res)=>{

    await db.query(

        "DELETE FROM vehicles WHERE id=?",

        [req.params.id]

    );

    res.json({

        status:true,

        message:"Vehicle Deleted"

    });

};