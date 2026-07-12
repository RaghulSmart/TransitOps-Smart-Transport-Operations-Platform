$(document).ready(function () {

    //Save Process
    $('#save-vehicle').on('click',function(){
        let registration_no = $('#registration_no').val();
        if( registration_no == '' || ! /^[A-Z]{2}\d{1,2}[A-Z]{1,2}\d{1,4}$/.test(registration_no) ) {
            Swal.fire({
                icon: "error",
                text: "Invalid Registration Number, Please check and try again"
            });
            return;
        }
        let odometer = $('#odometer').val();
        if( ! odometer || ! /^\d+$/.test(odometer)) {
            Swal.fire({
                icon: "error",
                text: "Please enter a number in odometer field"
            });
            return;
        }
        let acquisition_cost = $('#acquisition_cost').val();
        if( ! acquisition_cost || ! /^\d+$/.test(acquisition_cost)) {
            Swal.fire({
                icon: "error",
                text: "Please enter a number in Acquisition Cost field"
            });
            return;
        }
        let max_load_capacity = $('#max_load_capacity').val();
        if( ! max_load_capacity || ! /^\d+$/.test(max_load_capacity) || max_load_capacity > 500000 || max_load_capacity == 0 ) {
            Swal.fire({
                icon: "error",
                text: "Please enter a releastic maximum load capacity"
            });
            return;
        }
        $.ajax({
                url: "/vehicles/save",
                type: "POST",
                data: {
                    registration_no,
                    odometer,
                    max_load_capacity,
                    acquisition_cost,
                    vehicle_type : $('#vehicle_type').val(),
                    vehicle_model : $('#vehicle_model').val(),
                    status : $('#vehicle_status').val()
                },
                success: function (res) {
                    if (res.status) {
                        Swal.fire({
                            icon: "success",
                            text: res.message
                        }).then(() => {
                            location.reload();

                        });
                    } else {
                        Swal.fire({
                            icon: "error",
                            text: res.message
                        });
                    }
                }
            });
    });
   
});