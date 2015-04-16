

if (typeof mac_browser_test === 'undefined') {
    document.addEventListener('deviceready', onDeviceReady, false);
} else {
    initialize();
}

function onDeviceReady() {
    console.log(">device is ready");
    document.addEventListener("backbutton", onBackButtonClick, false);
    initialize();
}

//Used to fire back event in case of Desktop development to easily test the code
function keyDownTextField(e) {
    if(e.keyCode == 66) { //b keyboard character
        onBackButtonClick();
    }
}

function onBackButtonClick() {
    console.log("Back button:");
    historyPop();
    var back = historyPop(); //it will be added again in onDisplay()
    if(typeof back !== 'undefined') {
        doDisplay(back.book_code, back.page_id)
    }
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
    setTocHeight();

    //simulate the andorid device back button
    document.addEventListener("keydown", keyDownTextField, false);
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
     //Hide to avoid flickering while updating content
      $('#main-page-contents').hide();

    //call display
    getDisplay(book_code, page_id).done(function (result) {
        window.localStorage.setItem("book_code", result.book_code);
        window.localStorage.setItem("page_id", result.page_id);

        if(book_code.length > 0) {
            //Head of the display and TOC
            doTabweeb(result.title, result.book_code, result.page_id, result.parent_id);

            //$('#article-title').empty();
            //$('#article-title').append(result.title);

            $('#article-body').empty();
            var parts = result.page.split("##");

            $('#article-body').append(parts[0]);
            if (parts.length > 1 && $.trim(parts[1]).length > 0) {
                var footnote = parts[1];
                footnote = footnote.split("\n").join("<br>")
                $('#article-body').append("<hr>" + footnote);
            }
        } else {
            //home page
            $('#article-title').empty();
            $('#article-body').empty();
            $('#article-body').append(result);
            $('#display-tree-body').empty();
            doTabweebBookList();

        }
        historyPush({book_code: book_code, page_id: page_id});
//        $('.page_fts').empty();
//        $('.page_fts').append(page.page_fts);

    });

    //Add body of nodes if there are kids
    if(book_code.length > 0) {

        //if there are kids, display them
        getKidsNodes(book_code, page_id).done(function (kids) {
            var len = kids.length;
            if (len == 0) {
                $('#display-tree-body').empty();
            }
                        
            for (var i = 0; i < len; i++) {
                if(i == 0) {
                    $('#display-tree-body').empty();
                    $('#article-body').empty();
                }
                var hrefParameters = "('" + book_code + "', '" + kids[i].page_id + "')";
                $('#display-tree-body').append("<a href=\"javascript:doDisplay" + hrefParameters +
                "\">" + kids[i].title + "</a><br>");
            }
        });
        $("#next-prev-buttons").show();


    } else {
        //There is no display, just book list
        $("#next-prev-buttons").hide();

    }

    //This function helps hide the tree part flickering
    var myVar = setInterval(function(){
                 clearInterval(myVar);
                   $('#main-page-contents').show();
        }, 100);


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
    if(typeof book_code === 'undefined' || book_code.length === 0) {
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
    $('#display-tree-head').empty();

    var level = 0;
    showParentNodePath(book_code, page_id, parent_id);

    //display title
    $('#tabweeb-tree-head').append(title);
    $('#display-tree-head').append(title);
    $('#display-tree-head').append("<hr>");

    ////////////////////////////////////////////////

    getKidsNodes(book_code, page_id).done(function (kids) {
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

function doTabweebBookList() {
    $('#tabweeb-tree-head').empty();
    $('#tabweeb-tree-body').empty();
    $('#display-tree-head').empty();
}

//recursive function
function showParentNodePath(book_code, page_id, parent_id) {
    if (page_id.valueOf() != "0") {
        getParentNode(book_code, page_id, parent_id).done(function (parent) {
            if (typeof parent !== 'undefined') {
                //prepend: insert at the start
                var anchor = strf("<a href='javascript:doDisplay(\"{0}\", \"{1}\")')>{2}</a>", book_code, parent_id, parent.title);
                $('#tabweeb-tree-head').prepend(anchor + "<br>");
                $('#display-tree-head').prepend(anchor + "<br>");
            }
            //Recursive call
            if (typeof parent !== 'undefined' && parent.page_id != "0") {
                showParentNodePath(book_code, parent.page_id, parent.parent_id)
            }
        });
    }
}

//FIXME change Tabweeb to Toc

function setTocHeight() {
    var height = $(window).height() - $("#toc-separator").position().top ;
    $('.scollable-table-tabweeb').css('max-height', height + 'px');
    console.log(">Tabweeb hits height: " + height);
}

//Browser history back button support

var urlsHistory = [];

function historyPush(url) {
    urlsHistory.push(url);
}

function historyPop() {
    return urlsHistory.pop();
}


