var memoCount = 0;
var eventCount = 0;
var colorCount = 0;

//DD:05
$("body").ready(
    function () 
    {
        changeColour(localStorage.getItem('color'));
    }
)


//Heavily modified from the Thyroid app
$(document).on("pageshow", function () 
{
    if ($('.ui-page-active').attr('id') == "pageHome") 
    {
        //Code to click login when enter pressed in the pw field DD:08
        var input = document.getElementById("passcode");
        input.addEventListener("keyup",
        function (event) 
        {
            event.preventDefault();

            if (event.keyCode === 13)
            {
                document.getElementById("LogInButton").click();
            }

        })
    }
    else if ($('.ui-page-active').attr('id') == "pageMemo") 
    {
        requestMemos();
        if(memoCount == 0)
        {
            $("body").ready(function() 
            {
                console.log("Test");
       
                $("body").on("click", ".memodisp", function () {console.log($(this).attr("id")); displayMemo($(this).attr("id"))})
            });

            memoCount += 1;
        }
    } 
    else if ($('.ui-page-active').attr('id') == "pageEvents") 
    {
    } 
    else if ($('.ui-page-active').attr('id') == "newPageEvents") 
    {
        requestEvents();
        if(eventCount == 0)
        {
            $("body").on("click", ".eventdisp", function () {console.log($(this).attr("id")); displayEvent($(this).attr("id"))});
            eventCount += 1;
        }
    }
    else if ($('.ui-page-active').attr('id') == "pageColorSelect") //Daniel DD:05
    {
        if(colorCount == 0)
        {
            $("body").on("click", ".colorBtn", function () {console.log($(this).attr("id")); changeColour($(this).attr("id"))});
            colorCount += 1;
        }
    }
    else if ($('.ui-page-active').attr('id') == "pageMessanger") 
    {
    } 
    else if ($('.ui-page-active').attr('id') == "pageRelax") 
    {
    }
    else if ($('.ui-page-active').attr('id') =="pageMenu") 
    {
        
        $("#btnLogout").click(function () //DD:07
        {
            logout();     
            location.reload();
            console.log(document.cookie.split(';'));
        });
    }
    else if ($('.ui-page-active').attr('id') == "pageTimer")
    {
        /*$(function() //Trial code to get timers working on page load
        {
                //$(".example").TimeCircles().destroy(); 
                //$("#myTimer").attr('data-timer', 900);
                var colorname = localStorage.getItem('color').toLowerCase();

                $(".example").TimeCircles(
                { time: 
                        { Days: { show: false }, 
                        Hours: { show: false }, 
                        Minutes: { color: colorname },
                        Seconds: { color: colorname }
                    }
                });
                $(".example").TimeCircles({circle_bg_color: "#000000"}); 
            });*/
    }
});


//S
function getCookie(name) 
{
    var dc = document.cookie;
    console.log(dc);
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    }
    else
    {
        begin += 2;
        var end = document.cookie.indexOf(";", begin);
        if (end == -1) {
        end = dc.length;
        }
    }
    // because unescape has been deprecated, replaced with decodeURI
    //return unescape(dc.substring(begin + prefix.length, end));
    return decodeURI(dc.substring(begin + prefix.length, end));
} 