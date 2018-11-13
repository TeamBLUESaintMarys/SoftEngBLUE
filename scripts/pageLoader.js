$(document).on("pageshow", function () 
{
    if ($('.ui-page-active').attr('id') == "pageMemo") 
    {
        requestMemos();
        /*$(".memodisp").click(function ()
        {
           console.log($(this).attr("id"));
           displayMemo($(this).attr("id"));
        });*/
        $("body").on("click", ".memodisp", function () {console.log($(this).attr("id")); displayMemo($(this).attr("id"))});
    } 
    else if ($('.ui-page-active').attr('id') ==
    "pageEvents") {
  } else if ($('.ui-page-active').attr('id') ==
    "pageMessanger") {
  } else if ($('.ui-page-active').attr('id') ==
    "pageRelax") {
  }
  else if ($('.ui-page-active').attr('id') ==
    "pageMenu") {
    $("#btnLogout").click(function () 
      {
        console.log(document.cookie.split(';'));
      });
  }
});