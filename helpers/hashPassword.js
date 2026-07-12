const bcrypt = require("bcrypt");

bcrypt.hash("odoo@hackathon@2026",10).then(hash=>{

    console.log(hash);

});