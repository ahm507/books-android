
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
    $("#search-next-prev").hide();
    //set dynamic styles of scrollable boxes dynamically
    setTabweebHeight();

}

// SWIPE Support for touch screens
$(document).on("pagecreate", "#demo-page", function () {
    $(document).on("swipeleft swiperight", "#demo-page", function (e) {
        // We check if there is no open panel on the page because otherwise
        // a swipe to close the left panel would also open the right panel (and v.v.).
        // We do this by checking the data that the framework stores on the page element (panel: open).
        if ($(".ui-page-active").jqmData("panel") !== "open") {
            if (e.type === "swipeleft") {
                doDisplayPrevious();
            } else if (e.type === "swiperight") {
                doDisplayNext();
            }
        }
    });
});


function doDisplay(book_code, page_id) {
    //call display
    getDisplay(book_code, page_id).done(function (result) {
        window.localStorage.setItem("book_code", result.book_code);
        window.localStorage.setItem("page_id", result.page_id);

        if(book_code.length > 0) {
            $('#article-title').empty();
            $('#article-title').append(result.title);

            $('#article-body').empty();
            var parts = result.page.split("##");

            $('#article-body').append(parts[0]);
            if (parts.length > 1 && $.trim(parts[1]).length > 0) {
                var footnote = parts[1];
                //footnote.replace(/\\n/g, "\\n<br>")
                footnote = footnote.split("\n").join("<br>")
                $('#article-body').append("<hr>" + footnote);
            }
            doTabweeb(result.title, result.book_code, result.page_id, result.parent_id);

        } else {
            //home page
            $('#article-title').empty();
            $('#article-body').empty();
            $('#article-body').append(result);
        }

//        $('.page_fts').empty();
//        $('.page_fts').append(page.page_fts);


    });

}

function doDisplayFromSearch(book_code, page_id) {
    doDisplay(book_code, page_id);
    $("#left-panel").panel("close");
}

function doDisplayPrevious() {
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

function doDisplayNext() {
    var page_id = window.localStorage.getItem("page_id");
    page_id++;
    var book_code = window.localStorage.getItem("book_code");
    console.log('Next: page_id = ' + page_id + ', book_code:' + book_code);
    page_id = page_id + "";
    doDisplay(book_code, page_id);
}

function doSearch(pageNo) {
    var queryString = $('#query-string').val();
    //alert(queryString)
    queryString = queryString.trim();
    if (queryString.length <= 0) {
        return;
    }

    var pageSize = 10;
    var book_code = window.localStorage.getItem("book_code");
    if(book_code == 'undefined' || book_code.length === 0) {
        console.log("Empty book_code");
        book_code = "";
    }

    getSearchHits(book_code, queryString, pageSize, pageNo).done(function (hits) {
        $('#search-hits').empty();
        var len = hits.length;
        var pageLength = 10;
        for (var i = 0; i < len && i < pageLength ; i = i + 1) {
            var title = hits[i].title;
            var page_id = hits[i].page_id;
            var book_code = hits[i].book_code;
            //var searchWords = result_obj.words.join(",");
            var params = strf("('{0}', '{1}')", book_code, page_id);
            var row = strf("<tr><td><a href=\"javascript:doDisplayFromSearch{0}\">{1}</a></td></tr>", params, title);
            $('#search-hits').append(row);
        }
    });

    //Get total hist to adjust paging :(
    getSearchHitsTotalCount(book_code, queryString).done(function (results) {

        var total_count = results.total_count;

        var hitsCount = "نتائج البحث";
        $('#search-hits-count').text(hitsCount + " (" + total_count + ")");

        //Adjust paging
        var lastPageNo = Math.ceil(total_count / pageSize);
        if (pageNo > lastPageNo) {
            pageNo--;
        }
        lastPageNo > 0 ? $("#search-next-prev").show() : $("#search-next-prev").hide();
        $("search-page-no").text("" + lastPageNo + "/" + pageNo);
        window.localStorage.setItem("searchPageNo", pageNo);
        window.localStorage.setItem("totalPages", lastPageNo);

    });
}


function searchNext() {
    var pageNo = window.localStorage.getItem("searchPageNo");
    var totalPages = window.localStorage.getItem("totalPages");
    pageNo++;
    if (pageNo > totalPages) {
        pageNo--;
        return;
    }
    doSearch(pageNo);
}

function searchPrevious() {
    var pageNo = window.localStorage.getItem("searchPageNo");
    pageNo--;
    if (pageNo < 1) {
        pageNo = 1;
        return;
    }
    doSearch(pageNo);
}


function doTabweeb(title, book_code, page_id, parent_id) {
    $('#tabweeb-tree-head').empty();

    var level = 0;
    showParentNodePath(book_code, page_id, parent_id);


    //display title
    $('#tabweeb-tree-head').append("<i><b>" + title + "</b></i><br>");

    ////////////////////////////////////////////////

    getKidsNodes(book_code, page_id, parent_id).done(function (kids) {
        $('#tabweeb-tree-body').empty();

        var len = kids.length;
        for (var i = 0; i < len; i++) {
            var hrefParameters = "('" + book_code + "', '" + kids[i].page_id + "')";
            $('#tabweeb-tree-body').append("<tr><td><a href=\"javascript:doDisplay" + hrefParameters +
            "\">" + kids[i].title + "</a></td></tr>");
            $('#tabweeb-tree-body').append("<br>");
        }

        if(len == 0) { //no kids
            $("#right-panel").panel("close");
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
            }
            //Recursive call
            if (parent != undefined && parent.page_id != "0") {
                showParentNodePath(book_code, parent.page_id, parent.parent_id)
            }
        });
    }
}

function setTabweebHeight() {

    var height = $(window).height() - $("#toc-separator").position().top ;
    //if($(window).width() >= 800) {
    //    height = height - $(".demo-page-top-header").height() - 10;
    //}

    $('.scollable-table-tabweeb').css('max-height', height + 'px');
    console.log(">Tabweeb hits height: " + height);

}

