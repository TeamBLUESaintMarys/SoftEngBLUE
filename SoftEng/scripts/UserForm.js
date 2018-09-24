var SERVER_URL = 'http://127.0.0.1:3000';

$("#btnUserClear").click(function () {
  clearUserForm();
});

$("#btnUserUpdate").click(function () { //Event : submitting the form
  saveUserForm();
  return true;
});

function checkUserForm() { //Check for empty fields in the form
  //for finding current date 
  var d = new Date();
  var month = d.getMonth() + 1;
  var date = d.getDate();
  var year = d.getFullYear();
  var currentDate = year + '/' +
    (('' + month).length < 2 ? '0' : '') +
    month + '/' +
    (('' + date).length < 2 ? '0' : '') + date;

  if (($("#txtEmail").val() != "") &&
    ($("#txtFirstName").val() != "") &&
    ($("#txtLastName").val() != "") &&
    ($("#txtHealthCardNumber").val() != "") &&
    ($("#datBirthdate").val() != "") && ($(
      "#datBirthdate").val() <= currentDate) &&
    ($("#slcCancerType option:selected").val() !=
      "Select Cancer Type") &&
    ($("#slcCancerStage option:selected").val() !=
      "Select Cancer Stage") &&
    ($("#slcTSHRange option:selected").val() !=
      "Select TSH Range")) {
    return true;
  } else {
    return false;
  }
}

function saveUserForm() {
  if (checkUserForm()) {
    var user = {
      "email": $("#txtEmail").val(),
      "firstName": $("#txtFirstName").val(),
      "lastName": $("#txtLastName").val(),
      "healthCardNumber": $(
        "#txtHealthCardNumber").val(),
      "newPassword": $("#changePassword").val(),
      "dateOfBirth": $("#datBirthdate").val(),
      "cancerType": $(
        "#slcCancerType option:selected").val(),
      "cancerStage": $(
        "#slcCancerStage option:selected").val(),
      "tshRange": $(
        "#slcTSHRange option:selected").val()
    };
    if ($("#btnUserUpdate").val() == "Create") {
      var userData = {
        newUser: user
      }
      $.post(SERVER_URL + '/saveNewUser',
        userData,
        function (data) {
          alert(
            "New User Created Successfully!"
          );
          sessionStorage.user = JSON.stringify(
            user);
          sessionStorage.password = user.newPassword;
          $("#btnUserUpdate").val("Update");
          $.mobile.changePage("#pageMenu");
          window.location.reload();
        }).fail(function (error) {
        alert(error.responseText);
      });
    } else {
      user.agreedToLegal = JSON.parse(
        sessionStorage.user).agreedToLegal;
      user.password = sessionStorage.password;
      $.post(SERVER_URL + '/updateUser', user,
        function (data) {
          sessionStorage.user = JSON.stringify(
            user);
          sessionStorage.password = user.newPassword;
        }).fail(function (error) {
        alert(error.responseText);
      }).done(function () {
        $.mobile.changePage("#pageMenu");
        window.location.reload();
      });
    }
  } else {
    alert("Please complete the form properly.");
  }
}

function clearUserForm() {
  sessionStorage.clear("user");
  alert("The stored data have been removed");
  $("#slcCancerStage").val(
    "Select Cancer Stage");
  $('#slcCancerStage').selectmenu('refresh',
    true);
  $("#slcCancerType").val("Select Cancer Type");
  $('#slcCancerType').selectmenu('refresh',
    true);
  $("#slcTSHRange").val("Select TSH Range");
  $('#slcTSHRange').selectmenu('refresh', true);
}

function showUserForm() { //Load the stored values in the form
  if (sessionStorage.user != null) {
    $("#btnUserUpdate").val("Update").button(
      "refresh");
    var user = JSON.parse(sessionStorage.user);
    $("#txtEmail").val(user.email);
    $("#txtFirstName").val(user.firstName);
    $("#txtLastName").val(user.lastName);
    $("#txtHealthCardNumber").val(user.healthCardNumber);
    $("#changePassword").val(user.newPassword);
    $("#datBirthdate").val(user.dateOfBirth);
    $('#slcCancerType option[value=' + user.cancerType +
      ']').attr('selected', 'selected');
    $("#slcCancerType option:selected").val(
      user.cancerType);
    $('#slcCancerType').selectmenu('refresh',
      true);
    $('#slcCancerStage option[value=' + user.cancerStage +
      ']').attr('selected', 'selected');
    $("#slcCancerStage option:selected").val(
      user.cancerStage);
    $('#slcCancerStage').selectmenu('refresh',
      true);
    $('#slcTSHRange option[value=' + user.tshRange +
      ']').attr('selected', 'selected');
    $("#slcTSHRange option:selected").val(user.tshRange);
    $('#slcTSHRange').selectmenu('refresh',
      true);
  } else {
    $("#btnUserUpdate").val("Create").button(
      "refresh");
  }
}