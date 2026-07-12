$(document).ready(function () {

    //Filter Process
    const table = $('#driversTable').DataTable({
        pageLength: 10,
        ordering: true,
        info: true
    });

    // Filter by Status
    $('#status_filter').on('change', function () {

        const value = $.fn.dataTable.util.escapeRegex($(this).val());

        table.column(7)
            .search(value ? value : '', true, false)
            .draw();

    });

    //Save Process
    $('#save-driver').on('click',function(){
        let license_number = $('#license_number').val();
        if( license_number == '' || ! /^[A-Z]{2}\d{2}\d{4,11}$/.test(license_number) ) {
            Swal.fire({
                icon: "error",
                text: "Invalid License Number, Please check and try again"
            });
            return;
        }
        let safety_score = $('#safety_score').val();
        if( ! safety_score || ! /^\d+$/.test(safety_score) || safety_score > 100 || safety_score <= 0 ) {
            Swal.fire({
                icon: "error",
                text: "Please enter a valid safety score"
            });
            return;
        }
        let phone = $('#phone').val();
        if( ! phone || ! /^\d{10}$/.test(phone)) {
            Swal.fire({
                icon: "error",
                text: "Please enter a valid phone number"
            });
            return;
        }
        let license_expiry = $('#license_expiry').val();
        if( ! license_expiry ) {
            Swal.fire({
                icon: "error",
                text: "Please select license expiry date"
            });
            return;
        }
        let license_category = $('#license_category').val();
        if( ! license_category || ! /^[A-Z]{3,6}$/.test(license_category) ) {
            Swal.fire({
                icon: "error",
                text: "Please enter a valid license category (LMV,HMV,etc.,)"
            });
            return;
        }
        let name = $('#name').val();
        if( ! name || name.length < 3 || name.length > 100 ) {
            Swal.fire({
                icon: "error",
                text: "Please enter a valid name with maximum of 100 characters and minimum of 3 characters"
            });
            return;
        }
        $('#save-driver').hide();
        $.ajax({
                url: "/drivers/save",
                type: "POST",
                data: {
                    name,
                    license_number,
                    license_category,
                    license_expiry,
                    phone,
                    safety_score,
                    status : $('#driver_status').val()
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
                        $('#save-driver').show();
                        Swal.fire({
                            icon: "error",
                            text: res.message
                        });
                    }
                }
            });
    });
   
});