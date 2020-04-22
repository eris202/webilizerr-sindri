 "use strict";

function callApi(id) {
  $(".loader").show();
  $(".form-data").hide();

  jQuery
    .ajax({
      url: "http://localhost:5555/check/report",
      type: "POST",
      data: {
        report_id: id,
      },
    })
    .done(function (response) {
      if (response == "wait") {
        setTimeout(function () {
          callApi(id);
        }, 15000);
      } else {
        location.href = "http://localhost:5555/report/" + id;
      }
    })
    .fail(function (error) {
      console.log(error);
    });
}
