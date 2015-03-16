// We use an "Immediate Function" to initialize the application to
// avoid leaving anything behind in the global scope

//var search = new PageService();

////Module pattern
//(function () {

    /* ---------------------------------- Local Variables ---------------------------------- */


    /* --------------------------------- Event Registration -------------------------------- */


    if(typeof mac_browser_test === 'undefined') {

        document.addEventListener('deviceready', onDeviceReady, false);
    } else {
        initialize();
    }



  function onDeviceReady() {

    initialize();

    }


    function initialize() {


          console.log(">device is ready");

        console.log(">Override alert to use native interface");

        //override the window.alert() function and replace its default implementation
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

        console.log(">initialize search database");
        initializeDB();

//      console.log(">initial doDisplay  is going to be called");

    }



    //FIXME MOVE to onDeviceReady
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




//
//}());



function doDisplay(book_code, page_id) {
    //call display
    display(book_code, page_id).done(function (result) {
//        $.cookie("book_code", page.book_code);
//        $.cookie("page_id", page.page_id);
        window.localStorage.setItem("book_code", result.book_code);
        window.localStorage.setItem("page_id", result.page_id);

        $('#article-title').empty();
        $('#article-title').append(result.title);

        $('#article-body').empty();
        var parts = result.page.split("##");

        $('#article-body').append(parts[0]);
        if(parts.length > 1) {
            $('#article-body').append("<hr>" + parts[1]);
        }

//        $('.page_fts').empty();
//        $('.page_fts').append(page.page_fts);

        doTabweeb (page.title, book_code, page_id, page.parent_id);

    });

}

function doPrevious() {
//    var page_id = $.cookie("page_id");
    var page_id = window.localStorage.getItem("page_id");

    page_id--; //automatic conversion to integer
    if(page_id < 0) {
        //just do nothing
        return;
    }
//    book_code = $.cookie('book_code');
    var book_code = window.localStorage.getItem("book_code");

    console.log('Previous: page_id = ' + page_id + ', book_code:' + book_code);
    page_id = page_id + ""; //convert to text as required by sqlite query
    doDisplay(book_code, page_id);
}

function doNext() {
//    var page_id = $.cookie("page_id");
    var page_id = window.localStorage.getItem("page_id");

    page_id++;
//    book_code = $.cookie('book_code');
    var book_code = window.localStorage.getItem("book_code");

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

//    getParentNode(book_code, page_id, parent_id).done(function (parents) {
//        $('#tabweeb-tree-head').empty();
//        console.log('Getting parent of page_id=' + page_id);
//        for(var i = parents.length-1; i >= 0;i--) {
//            $('#tabweeb-tree-head').append(parents[i].title + "<br>");
//        }
//        //display title
//        $('#tabweeb-tree-head').append("<i><b>" + page.title + "</b></i><br>");
//    });

    $('#tabweeb-tree-head').empty();

    var level = 0
    var parents = []

    showParentNodePath(title, book_code, page_id, parent_id, level, parents);

        //display title
    $('#tabweeb-tree-head').append("<i><b>" + title + "</b></i><br>");


////////////////////////////////////////////////


    getKidsNodes(book_code, page_id, parent_id).done(function (kids) {
        $('#tabweeb-tree-body').empty();

        var len = kids.length;
        for(var i = 0; i < len ; i++) {
            var hrefParameters = "('" + book_code + "', '" + kids[i].page_id + "')";
            $('#tabweeb-tree-body').append("<a href=\"javascript:doDisplay" + hrefParameters +
                    "\">" + kids[i].title + "</a>");
            $('#tabweeb-tree-body').append("<br>");
        }

    });
}

function showParentNodePath(title, book_code, page_id, parent_id, level, parents) {

    level += 1;
    if(page_id.valueOf() != "0") {

        getParentNode(book_code, page_id, parent_id).done(function (parent) {

            if( parent != undefined ) {
                //prepend: append at the start
//                var hrefParameters = "('" + book_code + "', '" + kids[i].page_id + "')";
                $('#tabweeb-tree-head').prepend(getSpaces(level) + parent.title + "<br>");
                parents.push(parent);
            }

            //Recursive call
            if(parent != undefined && parent.page_id != "0") {
                showParentNodePath(title, book_code, parent.page_id, parent.parent_id, level, parents)
            }

        });
    }

}

function getSpaces (count) {
    var spaces = ""
    for(var i = 0; i < count ; i++) {
        spaces += "&nbsp;&nbsp;&nbsp;";
    }
    return spaces;
}


//
//http://www.javascriptkit.com/javatutors/loadjavascriptcss.shtml
//
//function loadjscssfile(filename, filetype){
//    if (filetype=="js"){ //if filename is a external JavaScript file
//        var fileref=document.createElement('script')
//        fileref.setAttribute("type","text/javascript")
//        fileref.setAttribute("src", filename)
//    }
//    else if (filetype=="css"){ //if filename is an external CSS file
//        var fileref=document.createElement("link")
//        fileref.setAttribute("rel", "stylesheet")
//        fileref.setAttribute("type", "text/css")
//        fileref.setAttribute("href", filename)
//    }
//    if (typeof fileref!="undefined")
//        document.getElementsByTagName("head")[0].appendChild(fileref)
//}
//
//loadjscssfile("myscript.js", "js") //dynamically load and add this .js file
