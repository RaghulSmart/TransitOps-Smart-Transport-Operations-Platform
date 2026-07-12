const db = require("../config/db");

exports.index = async (req, res) => {

    const [vehicles] = await db.query(
        "SELECT v.id,CONCAT(vm.model,'-',vt.type,'-',registration_no) as vehicle_name FROM vehicles v, vehicle_models vm, vehicle_types vt WHERE status = 'available' AND vm.id = v.vehicle_model_id AND vt.id=vehicle_type_id ORDER BY id DESC"
    );
    const [drivers] = await db.query(
        "SELECT * FROM drivers WHERE status = 'available' ORDER BY id DESC"
    );
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
    const [trips] = await db.query(
        "SELECT t.id trip_code, CONCAT(source,' -> ',destination) place, vm.model, d.name, t.status FROM trips t, vehicles v, vehicle_models vm, drivers d WHERE t.vehicle_id = v.id AND v.vehicle_model_id = vm.id AND t.driver_id = d.id ORDER BY t.id DESC"
    );
    res.render("trips/index", {
        drivers,
        trips,
        vehicles,
        display_trip_status,
        user: req.session.user,
        footer_scripts:"<script src='/js/trips.js'></script>"
    });

};

exports.save = async (req, res) => {
    //TO-DO: Need to add validation on here as well
    try {

        const {
            vehicle_id,
            driver_id,
            revenue,
            source,
            destination,
            cargo_weight,
            planned_distance
        } = req.body;

        const [exists] = await db.query(
            "SELECT max_load_capacity FROM vehicles WHERE id=?",
            [vehicle_id]
        );

        if (! exists.length) {

            return res.json({
                status:false,
                message:"Invalid data received."
            });

        } else {
            const max_load_capacity = exists[0].max_load_capacity;
            if( cargo_weight > max_load_capacity ) {
               return res.json({
                    status:false,
                    message:"Sorry the selected vehicle cannot be used for this cargo since the maximum load capacity is "+max_load_capacity
                }); 
            }
        }

        await db.query(

            `INSERT INTO trips
            (
                vehicle_id,
                driver_id,
                revenue,
                source,
                destination,
                cargo_weight,
                planned_distance,
                status,
                actual_distance,
                start_odometer,
                end_odometer
            )

            VALUES (?,?,?,?,?,?,?,?,?,?,?)`,

            [
                vehicle_id,
                driver_id,
                revenue,
                source,
                destination,
                cargo_weight,
                planned_distance,
                'dispatched',
                0,
                0,
                0
            ]

        );

        db.query("UPDATE vehicles SET status = 'on_trip' WHERE id = ? ",[vehicle_id]);
        db.query("UPDATE drivers SET status = 'on_trip' WHERE id = ? ",[driver_id]);

        res.json({

            status:true,

            message:"Trip created successfully"

        });

    } catch(err){

        console.log(err);

        res.json({

            status:false,

            message:"Something went wrong."

        });

    }

};