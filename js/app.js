

$(document).ready(function() {
  $("#noWeb3").show();

  //bootstrap file browser filename work around
  $("input[type=file]").change(function () {
    var fieldVal = $(this).val();
    if (fieldVal != undefined || fieldVal != "") {
      $(this).next(".custom-file-control").attr('data-content', fieldVal.replace("C:\\fakepath\\", ""));
    }
  });

  notary_init();
});




function clearResponse() {
  $("#response").hide();
};

function setProvider() {
  var host = $("#host").val();


  if (host) {
    customProvider = host;
    notary_init();
  }

}



function hashForFile(callback) {
  if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
      alert("The File APIs are not fully supported in this browser.");
      return;
  }

  input = document.getElementById("hashFile");
  if (!input.files[0]) {
    alert("Please select a file first");
  }
  else {
    file = input.files[0];
    fr = new FileReader();
    fr.onload = function (e) {
      content = e.target.result;
      var shaObj = new jsSHA("SHA-256", "ARRAYBUFFER");
      shaObj.update(content);
      var hash = "0x" + shaObj.getHash("HEX");
      callback(null, hash);
    };
    fr.readAsArrayBuffer(file);
  }

};

function send () {
  hashForFile(function (err, hash) {
    notary_send(hash, function(err, tx) {
      $("#responseText").html("<p>File successfully fingreprinted onto Ethereum blockchain.</p>"
        + "<p>File Hash Value: " + hash +"</p>"
        + "<p>Transaction ID: " + tx +"</p>"
        // + "<p>Available at contract address: " + address +"</p>"
        + "<p><b>Please alow a few minutes for transaction to be mined.</b></p>"
      );
      $("#response").removeClass("alert-success");
      $("#response").removeClass("alert-danger");
      $("#response").addClass("alert-primary");
      $("#response").show();
    });
  });
};

function find () {
  hashForFile(function (err, hash) {
    notary_find(hash, function(err, resultObj) {
      if (resultObj.blockNumber != 0) {
        var timeStamp =   new Date(resultObj.mineTime * 1000);
        $("#responseText").html("<p>File fingerprint found on Ethereum blockchain.</p>"
          + "<p>File Hash Value: " + hash + "</p>"
          + "<p>Block No.: " + resultObj.blockNumber + "</p>"
          + "<p>Timestamp: " + timeStamp + "</p>"
        );
        $("#response").removeClass("alert-danger");
        $("#response").removeClass("alert-primary");
        $("#response").addClass("alert-success");
        $("#response").show();
      } else {
        $("#responseText").html("<p>File fingerprint not found on Ethereum blockchain.</p>"
          + "<p>File Hash Value: " + hash + "</p>"
        );
        $("#response").removeClass("alert-primary");
        $("#response").removeClass("alert-success");
        $("#response").addClass("alert-danger");
        $("#response").show();
      }
    });
  });
};
