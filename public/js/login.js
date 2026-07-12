$("#loginForm").submit(function (e) {

    e.preventDefault();

    $.ajax({

        url: "/login",

        type: "POST",

        data: $(this).serialize(),

        beforeSend: function () {

            $("button").prop("disabled", true);

        },

        success: function (res) {

            $("button").prop("disabled", false);

            if (res.status) {

                Swal.fire({

                    icon: "success",

                    title: "Success",

                    text: res.message,

                    timer: 1000,

                    showConfirmButton: false

                });

                setTimeout(function () {

                    location.href = res.redirect;

                }, 1000);

            } else {

                Swal.fire({

                    icon: "error",

                    title: "Login Failed",

                    text: res.message

                });

            }

        },

        error: function () {

            $("button").prop("disabled", false);

            Swal.fire({

                icon: "error",

                title: "Server Error"

            });

        }

    });

});