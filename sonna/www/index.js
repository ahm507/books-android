
if (typeof mac_browser_test === 'undefined') {
    document.addEventListener('deviceready', onDeviceReady, false);
} else {
    initialize();
}

function onDeviceReady() {
    console.log(">device is ready");
    initialize();
}

function initialize() {

    //console.log(">Override alert to use native interface");
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

    initializeDB();

}

//FIXME MOVE to onDeviceReady
// SWIPE Support for touch screens
$(document).on("pagecreate", "#demo-page", function () {
    $(document).on("swipeleft swiperight", "#demo-page", function (e) {
        // We check if there is no open panel on the page because otherwise
        // a swipe to close the left panel would also open the right panel (and v.v.).
        // We do this by checking the data that the framework stores on the page element (panel: open).
        if ($(".ui-page-active").jqmData("panel") !== "open") {
            if (e.type === "swipeleft") {
                $("#right-panel").panel("open");
            } else if (e.type === "swiperight") {
                $("#left-panel").panel("open");
            }
        }
    });
});


//}());

function getSpaces(count) {
    var spaces = ""
    for (var i = 0; i < count; i++) {
        spaces += "&nbsp;&nbsp;&nbsp;";
    }
    return spaces;
}

//Example: var link = String.format('<a href="{0}/{1}/{2}" title="{3}">{3}</a>', url, year, titleEncoded, title);
function strf() {
    // The string containing the format items (e.g. "{0}")
    // will and always has to be the first argument.
    var theString = arguments[0];
    // start with the second argument (i = 1)

//    for(var i in allImgs)
    for (var i = 1; i < arguments.length; i++) {
        // "gm" = RegEx options for Global search (more than one instance)
        // and for Multiline search
        var regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
        theString = theString.replace(regEx, arguments[i]);
    }
    return theString;
}

function doDisplay(book_code, page_id) {
    //call display
    getDisplay(book_code, page_id).done(function (result) {
        window.localStorage.setItem("book_code", result.book_code);
        window.localStorage.setItem("page_id", result.page_id);

        $('#article-title').empty();
        $('#article-title').append(result.title);

        $('#article-body').empty();
        var parts = result.page.split("##");

        $('#article-body').append(parts[0]);
        if (parts.length > 1) {
            $('#article-body').append("<hr>" + parts[1]);
        }

//        $('.page_fts').empty();
//        $('.page_fts').append(page.page_fts);

        doTabweeb(page.title, book_code, page_id, page.parent_id);

    });

}

function doPrevious() {
    var page_id = window.localStorage.getItem("page_id");
    page_id--; //automatic conversion to integer
    if (page_id < 0) {
        return;
    }
    var book_code = window.localStorage.getItem("book_code");
    console.log('Previous: page_id = ' + page_id + ', book_code:' + book_code);
    page_id = page_id + ""; //convert to text as required by sqlite query
    doDisplay(book_code, page_id);
}

function doNext() {
    var page_id = window.localStorage.getItem("page_id");
    page_id++;
    var book_code = window.localStorage.getItem("book_code");
    console.log('Next: page_id = ' + page_id + ', book_code:' + book_code);
    page_id = page_id + "";
    doDisplay(book_code, page_id);
}

function doSearch() {
    var queryString = $('#query-string').val();
    //alert(queryString)
    queryString = queryString.trim();
    if (queryString.length <= 0) {
        return;
    }

//        $('#search-hits-count').text(hitsCount + " (" + total_count + ")");

    getSearchHits(queryString).done(function (hits) {
        $('#search-hits').empty();
        var len = hits.length;
        for (var i = 0; i < len; i = i + 1) {
            var title = hits[i].title;
            var page_id = hits[i].page_id;
            var book_code = hits[i].book_code;
            //var searchWords = result_obj.words.join(",");
            var params = strf("('{0}', '{1}')", book_code, page_id);
            var row = strf("<tr><td><a href=\"javascript:doDisplay{0}\">{1}</a></td></tr>", params, title);
            $('#search-hits').append(row);

        }

    });
}

function doTabweeb(title, book_code, page_id, parent_id) {
    $('#tabweeb-tree-head').empty();

    var level = 0;
    showParentNodePath(book_code, page_id, parent_id);
    //decorate nodes

    //var treeHeadHtml = $('#tabweeb-tree-head');
    //getSpaces(level) +

//     for(var i = 0 ; i < pathNodes.length ; i++ ) {
//         var anchor = strf("<a href='javascript:doDisplay(\"{0}\", \"{1}\")')>{2}</a>",
//                 pathNodes[i].book_code, pathNodes[i].parent_id, pathNodes[i].parent_title);
//         $('#tabweeb-tree-head').append(anchor + "<br>");

//     }

    //display title
    $('#tabweeb-tree-head').append("<i><b>" + title + "</b></i><br>");

    ////////////////////////////////////////////////

    getKidsNodes(book_code, page_id, parent_id).done(function (kids) {
        $('#tabweeb-tree-body').empty();

        var len = kids.length;
        for (var i = 0; i < len; i++) {
            var hrefParameters = "('" + book_code + "', '" + kids[i].page_id + "')";
            $('#tabweeb-tree-body').append("<a href=\"javascript:doDisplay" + hrefParameters +
            "\">" + kids[i].title + "</a>");
            $('#tabweeb-tree-body').append("<br>");
        }

    });
}

//recursive function
function showParentNodePath(book_code, page_id, parent_id) {

    if (page_id.valueOf() != "0") {

        getParentNode(book_code, page_id, parent_id).done(function (parent) {

            if (parent != undefined) {
                //prepend: insert at the start
                var anchor = strf("<a href='javascript:doDisplay(\"{0}\", \"{1}\")')>{2}</a>", book_code, parent_id, parent.title);
                $('#tabweeb-tree-head').prepend(anchor + "<br>");
//                 pathNodes.push({'book_code': book_code, 'parent_id': parent_id, 'parent_title': parent.title});
            }

            //Recursive call
            if (parent != undefined && parent.page_id != "0") {
                showParentNodePath(book_code, parent.page_id, parent.parent_id)
            }

        });
    }
}


