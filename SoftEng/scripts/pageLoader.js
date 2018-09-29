function resizeGraph() {
  if ($(window).width() < 700) {
    $("#GraphCanvas").css({
      "width": $(window).width() - 50
    });
    $("#AdviceCanvas").css({
      "width": $(window).width() - 50
    });
  }
}

// Attach event handler for window resizing event
$(window).resize(function () {
  resizeGraph();
});

/*Runs the function to display the user information, history,
 * graph or suggestions, every time their div is shown
 */
$(document).on("pageshow", function () {
  if ($('.ui-page-active').attr('id') ==
    "pageMemo") {
    //showUserForm();
  } else if ($('.ui-page-active').attr('id') ==
    "pageEvents") {
    //loadUserInformation();
    //listRecords();
  } else if ($('.ui-page-active').attr('id') ==
    "pageMessanger") {
    //advicePage();
    //resizeGraph();
  } else if ($('.ui-page-active').attr('id') ==
    "pageRelax") {
    //drawGraph();
    //resizeGraph();
  } else if ($('.ui-page-active').attr('id') ==
    "pageNewMemo") {
    //drawGraph();
    //resizeGraph();
  } 
});