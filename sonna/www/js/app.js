// We use an "Immediate Function" to initialize the application to
// avoid leaving anything behind in the global scope

var search = new PageService();

(function () {

    /* ---------------------------------- Local Variables ---------------------------------- */
    search.initialize().done(function () {
//        alert("search object initialized");
        console.log("search initialized");
    });

    //initialization code
    search.display("g2b1", "2");
//    search.display($.cookie('book_code'), $.cookie('page_id'));


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

//    var next = page_id + 1;
//    var prev_page = page_id - 1;
//    if(prev_page < 0) {
//        disable prev page
//    }
//

    alert("PREV");
}

function doNext() {
    var page_id = $.cookie("page_id");
    page_id++;
    book_code = $.cookie('book_code');
    console.log('Next: page_id = ' + page_id + ', book_code:' + book_code);

//    var search = new PageService();
//    search.initialize();
    page_id = page_id + "";
    search.display(book_code, page_id);
}

