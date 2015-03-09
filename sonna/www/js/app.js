// We use an "Immediate Function" to initialize the application to
// avoid leaving anything behind in the global scope


var search = new PageService();

(function () {

    /* ---------------------------------- Local Variables ---------------------------------- */
    search.initialize().done(function () {
        console.log("search initialized");
    });

    /* --------------------------------- Event Registration -------------------------------- */
    // override the window.alert() function and replace its default implementation
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

    /* ---------------------------------- Local Functions ---------------------------------- */

    //initialization code
    doDisplay("g2b1", "0");
//    search.display($.cookie('book_code'), $.cookie('page_id'));

}());


function doDisplay(book_code, page_id) {
    //call display
    search.display(book_code, page_id).done(function (page) {

        $.cookie("book_code", page.book_code);
        $.cookie("page_id", page.page_id);

        $('.article-title').empty();
        $('.article-title').append(page.title);

        $('.page').empty();
        $('.page').append(page.page);
        $('.page_fts').empty();
        $('.page_fts').append(page.page_fts);

        doTabweeb (page.title, book_code, page_id, page.parent_id);

    });

}

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
    doDisplay(book_code, page_id);
}

function doNext() {
    var page_id = $.cookie("page_id");
    page_id++;
    book_code = $.cookie('book_code');
    console.log('Next: page_id = ' + page_id + ', book_code:' + book_code);
    page_id = page_id + "";
    doDisplay(book_code, page_id);
}

function doSearch() {
//    alert("search");
    var queryString = $('#query-string').val();
    alert(queryString)
    queryString = queryString.trim();
    if(queryString.length <= 0) {
        return;
    }

    service.search(queryString).done(function (hits) {
        var len = hits.length;
        i = 0;
        for (; i < len; i = i + 1) {
//            console.log(hits[i].book_code + ", " + hits[i].page + ", " + hits[i].page_fts);
            $('.hits-list').empty();
            for (var i = 0; i < len; i++) {
                e = hits[i];
                $('.hits-list').append('<li><a href="#employees/' + e.id + '">' + e.page + ' ' + e.page_fts + '</a></li>');
            }
        }

    });
}



function doTabweeb (title, book_code, page_id, parent_id) {

//    search.getParentNode(book_code, page_id, parent_id).done(function (parents) {
//        $('#tabweeb-tree-head').empty();
//        console.log('Getting parent of page_id=' + page_id);
//        for(var i = parents.length-1; i >= 0;i--) {
//            $('#tabweeb-tree-head').append(parents[i].title + "<br>");
//        }
//        //display title
//        $('#tabweeb-tree-head').append("<i><b>" + page.title + "</b></i><br>");
//    });

    $('#tabweeb-tree-head').empty();


    showParentNodePath(title, book_code, page_id, parent_id);

        //display title
    $('#tabweeb-tree-head').append("<i><b>" + title + "</b></i><br>");



//    $('#tabweeb-tree-head').empty();
//    for(var i = parents.length-1; i >= 0;i--) {
//        $('#tabweeb-tree-head').append(parents[i].title + "<br>");
//    }
//    //display title
//    $('#tabweeb-tree-head').append("<i><b>" + page.title + "</b></i><br>");
//

////////////////////////////////////////////////


    search.getKidsNodes(book_code, page_id, parent_id).done(function (kids) {
        $('#tabweeb-tree-body').empty();

        var len = kids.length;
        for(var i = 0; i < len ; i++) {
            var hrefParameters = "('" + book_code + "', '" + kids[i].page_id + "')";
//            var hrefParameters = "()";
            $('#tabweeb-tree-body').append("<a href=\"javascript:doDisplay" + hrefParameters +
                    "\">" + kids[i].title + "</a>");
            $('#tabweeb-tree-body').append("<br>");
        }

    });
}

function showParentNodePath(title, book_code, page_id, parent_id) {

    if(page_id.valueOf() != "0") {

        search.getParentNode(book_code, page_id, parent_id).done(function (parent) {

            if( parent != undefined ) {
                $('#tabweeb-tree-head').append(parent.title + "<br>");
            }

            //Recursive call
            if(parent != undefined && parent.page_id != "0") {
                showParentNodePath(title, book_code, parent.page_id, parent.parent_id)
            }

        });
    }


}
