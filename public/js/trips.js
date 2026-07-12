$(document).ready(function () {
    //Data Table
    const table = $('#tripsTable').DataTable({
        pageLength: 10,
        ordering: true,
        info: true
    });

    //Save Process
    $('#save-trip').on('click',function(){
        let revenue = $('#revenue').val();
        if( revenue == '' || ! /^\d+$/.test(revenue) || revenue <= 0 ) {
            Swal.fire({
                icon: "error",
                text: "Please enter a valid revenue"
            });
            return;
        }
        let source  = $('#source').val();
        if( source == '' || source.length <= 1 ) {
            Swal.fire({
                icon: "error",
                text: "Please enter source place"
            });
            return;
        }
        let destination  = $('#destination').val();
        if( destination == '' || destination.length <= 1 ) {
            Swal.fire({
                icon: "error",
                text: "Please enter destination place"
            });
            return;
        }
        let cargo_weight = $('#cargo_weight').val();
        if( cargo_weight == '' || ! /^\d+$/.test(cargo_weight) || cargo_weight <= 0 ) {
            Swal.fire({
                icon: "error",
                text: "Please enter a valid cargo weight"
            });
            return;
        }
        let planned_distance = $('#planned_distance').val();
        if( planned_distance == '' || ! /^\d+$/.test(planned_distance) || planned_distance <= 0 ) {
            Swal.fire({
                icon: "error",
                text: "Please enter a valid Planned Distance"
            });
            return;
        }
        $('#save-trip').hide();
        $.ajax({
                url: "/trips/save",
                type: "POST",
                data: {
                   vehicle_id : $('#vehicle').val(),
                   driver_id : $('#driver').val(),
                   revenue,
                   source,
                   destination,
                   cargo_weight,
                   planned_distance
                },
                success: function (res) {
                    if (res.status) {
                        Swal.fire({
                            icon: "success",
                            text: res.message,
                            timer: 1000,
                            showConfirmButton: false
                        }).then(() => {
                            location.reload();
                        });
                    } else {
                        $('#save-trip').show();
                        Swal.fire({
                            icon: "error",
                            text: res.message
                        });
                    }
                }
            });
    });
   
});