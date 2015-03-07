// We use an "Immediate Function" to initialize the application to
// avoid leaving anything behind in the global scope

var search = new PageService();

(function () {

    /* ---------------------------------- Local Variables ---------------------------------- */
    search.initialize().done(function () {
//        alert("search object initialized");
        console.log("search initialized");
    });

    /* --------------------------------- Event Registration -------------------------------- */
//    $('.search-key').on('keyup', findByName);

//    override the window.alert() function and replace its default implementation
    document.addEventListener('deviceready', function () {
      if (navigator.notification) { // Override default HTML alert with native dialog
          window.alert = function (message) {
              navigator.notification.alert(
                  message,    // message
                  null,       // callback
                  "Sonna",    // title
                  'OK'        // buttonName
              );
          };
      }
      alert("on devide ready: ok");

    }, false);

    $('.help-btn').on('click', function() {
        alert("Search application v1.0");
    });

    /* ---------------------------------- Local Functions ---------------------------------- */

    //initialization code
    search.display("g2b1", "0");
//    search.display($.cookie('book_code'), $.cookie('page_id'));





}());



/*
$(document).on("pagecreate", "#demo-page", function(){

    //alert("Hellow");
    $("#search-tab").click();

});

$ (function() {
$('#article-content').load('article.html').trigger("create");
$.mobile.loadPage( "about/us.html" );

});
*/
// SWIPE Support for touch screens
$( document ).on( "pagecreate", "#demo-page", function() {

    $( document ).on( "swipeleft swiperight", "#demo-page", function( e ) {
        // We check if there is no open panel on the page because otherwise
        // a swipe to close the left panel would also open the right panel (and v.v.).
        // We do this by checking the data that the framework stores on the page element (panel: open).
        if ( $( ".ui-page-active" ).jqmData( "panel" ) !== "open" ) {
            if ( e.type === "swipeleft" ) {
                $( "#right-panel" ).panel( "open" );
            } else if ( e.type === "swiperight" ) {
                $( "#left-panel" ).panel( "open" );
            }
        }
    });
});


function doPrevious() {
    var page_id = $.cookie("page_id");
    page_id--; //automatic conversion to integer
    if(page_id < 0) {
        //just do nothing
        return;
    }
    book_code = $.cookie('book_code');
    console.log('Next: page_id = ' + page_id + ', book_code:' + book_code);
    page_id = page_id + ""; //convert to text as required by sqlite query
    search.display(book_code, page_id);
}

function doNext() {
    var page_id = $.cookie("page_id");
    page_id++;
    book_code = $.cookie('book_code');
    console.log('Next: page_id = ' + page_id + ', book_code:' + book_code);
    page_id = page_id + "";
    search.display(book_code, page_id);
}

