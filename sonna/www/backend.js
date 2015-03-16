// BACK END SERVICES ONLY, NO UI HERE

var database;
function initializeDB () {
    var deferred = $.Deferred();

    //Show Hour glass
    $.mobile.loading( "show", {
      text: "",
      textVisible: false,
      theme: "z",
      html: ""
    });

    //FIXME only copy on installation, first time, not with each run
    //it is important to remove any old pending file

    if(typeof mac_browser_test === 'undefined'){
        console.log("mac_browser_test is undefined ");
        window.plugins.sqlDB.remove("sonna.sqlite", removeSuccess, removeError);
        window.plugins.sqlDB.copy("sonna.sqlite", copySuccess, copyError);
    } else { //Browser debug
        console.log("mac_browser_test = ", mac_browser_test);
        OpenMyDatabase(); //oncopy event will not work
        doDisplay("g2b1", 0);
    }

    return deferred.promise();
}

function removeSuccess() {
    console.log(">SUCCESS, removed sonna.sqlite!!!");
}

function removeError() {
    console.log(">ERROR, unable to remove sonna.sqlite!!!");
}

function OpenMyDatabase(){
            //if not the debugger of my MAC
    if(typeof mac_browser_test === 'undefined'){
        //sqlitePlugin: "createFromLocation: 1" NEVER WORKS WITH ME
        database = window.sqlitePlugin.openDatabase({name:"sonna.sqlite"});

    } else { //My Desktop Debugger

        database = window.openDatabase("sqlite", "1.0", "sqlite", 20000000);
        database.transaction(
            function (tx) {
                createTable(tx);
                addSampleData(tx);
            },
            function (error) {
                console.log('Transaction error: ' + error);
                //deferred.reject('Transaction error: ' + error);
            },
            function () {
                console.log('DB init success');
                //deferred.resolve();
            }
        );
    }
}

function copySuccess () {
    console.log(">Success in copying sonna.sqlite");

    OpenMyDatabase();

        var page_id = "0";

        database.transaction(
            function (tx) {


              //Hide Hour glass
                $.mobile.loading( "hide", {
                      text: "",
                      textVisible: false,
                      theme: "z",
                      html: ""
                    });

                doDisplay("g2b1", 0);


            },
            function (error) {
               console.log(">Error: " + error.message);
            }
        );

}

function copyError() {
    console.log(">Failed to copy sonna.sqlite!!!");
}

function createTable (tx) {
    tx.executeSql('DROP TABLE IF EXISTS pages');
    var sql = "CREATE VIRTUAL TABLE pages USING fts3( " +
        "page_id, parent_id, book_code, title, page, page_fts);";
    tx.executeSql(sql, null,
        function () {
            //console.log('Create table success');

        },
        function (tx, error) {
            alert('Create table error: ' + error.message);
        });
    }

 function addSampleData (tx) {

    var ahadith = [
        {"page_id": "0", "parent_id": "NO_PARENT", "book_code": "g2b1", "title":"الأول", "page": "أَبَا سُفْيَانَ بْنَ حَرْبٍ أَخْبَرَهُ أَنَّ هِرَقْلَ أَرْسَلَ ", "page_fts": "قال" },
        {"page_id": "1", "parent_id": "0", "book_code": "g2b1", "title":"الثاني", "page": "البخاري", "page_fts": "البخاري" },
        {"page_id": "2", "parent_id": "0", "book_code": "g2b1", "title":"الثالث", "page": "حدثنا", "page_fts": "البخاري" },
        {"page_id": "3", "parent_id": "2", "book_code": "g2b1", "title":"Fourth", "page": "ابو هريرة", "page_fts": "كلام من غير تشكيل" },
        {"page_id": "4", "parent_id": "3", "book_code": "g2b1", "title":"Fifth", "page": " بالتشكيل عن عمر بن الخطاب", "page_fts": "كلام من غير تشكيل" },
        {"page_id": "5", "parent_id": "3", "book_code": "g2b1", "title":"Six", "page": "سمعت رسول", "page_fts": "الاعمال تاني" },
        {"page_id": "6", "parent_id": "5", "book_code": "g2b1", "title":"Seven", "page": "الله يقول", "page_fts": "اي حاجه" },
        {"page_id": "7", "parent_id": "5", "book_code": "g2b1", "title":"Eight", "page": "انما الاعمال بالنيات", "page_fts": "اما الاعمال بالنيات" }
    ];
    var l = ahadith.length;
    var sql = "INSERT OR REPLACE INTO pages " +
        "(page_id, parent_id, book_code, title, page, page_fts) " +
        "VALUES (?, ?, ?, ?, ?, ?)";
    var e;
    for (var i = 0; i < l; i++) {
        e = ahadith[i];
        tx.executeSql(sql, [e.page_id, e.parent_id, e.book_code, e.title, e.page, e.page_fts],
            function () {
                //console.log('INSERT success');
            },
            function (tx, error) {
                alert('INSERT error: ' + error.message);
                console.log('INSERT error: ' + error.message);
            });
    }
    console.log('Create sample data success');

}

function getSearchHits(queryString) {
    var deferred = $.Deferred();
    database.transaction(
        function (tx) {
            var sql = "SELECT * FROM pages where page_fts MATCH '" + queryString + "'";
            tx.executeSql(sql, [], function (tx, results) {
                //Fill Hits Info
                var len = results.rows.length;
                var hits = [];
                for (var i = 0; i < len; i = i + 1) {
                    hits[i] = results.rows.item(i);
                }
                deferred.resolve(hits);
                console.log("hits returned are " + results.rows.length)
            });
        },
        function (error) {
            console.log('>Search ERROR: ' + error.message);
            deferred.reject("Search Error: " + error.message);
        }
    );
    return deferred.promise();
}

function getDisplay (book_code, page_id) {
    var deferred = $.Deferred();

    //OpenMyDatabase();

    database.transaction(
        function (tx) {
            var sql = "SELECT * FROM pages where page_id MATCH ?";
            tx.executeSql(sql, [page_id], function (tx, results) {
                var len = results.rows.length;
                if(len != 1) {
                    //I expect an end of ids
                    console.log('>results != 1 !!! , len=' + len);
                    return;
                }

                page = results.rows.item(0);
                deferred.resolve(page);
//                  console.log('rows returned: ' + results[0].book_code);
            });
        },
        function (error) {
           deferred.reject("Display Error: " + error.message);
           console.log(">Error: " + error.message);
        }
    );
    return deferred.promise();
}

function getKidsNodes(book_code, page_id) {
    var deferred = $.Deferred();
    database.transaction(
        function (tx) {
            var sql = "SELECT * FROM pages where parent_id MATCH ?";
            tx.executeSql(sql, [page_id], function (tx, results) {
                var len = results.rows.length;
                if(len == 0) {
                    console.log('no kids ! , len=' + len);
                    var kids = []
                    deferred.resolve(kids); //simply no kids
                    return;
                }
                //Fill kids Info
                var len = results.rows.length,
                    kids = [], i = 0;
                for (; i < len; i = i + 1) {
                    kids[i] = results.rows.item(i);
                }
                deferred.resolve(kids);
            });
        },
        function (error) {
           deferred.reject("Display Error: " + error.message);
           console.log(">Error: " + error.message);
        }
    );
    return deferred.promise();
}

//FIXME support multiple books by adjusting queries
function getParentNode(book_code, page_id, parent_id) {
    var deferred = $.Deferred();
    database.transaction(
        function (tx) {
            var sql = "SELECT * FROM pages where page_id MATCH ?";
            var nodeId = parent_id;
                tx.executeSql(sql, [nodeId], function (tx, results) {
                    var len = results.rows.length;
                    if(len != 1) {
                        console.log('parent must be one node!!! , len=' + len);
                        var parent
                        deferred.resolve(parent); //return empty parents so the block works
                        return;
                    } else {
                        console.log('Got the parent, node_id=' + results.rows.item(0).page_id);
                    }
                    var parent = results.rows.item(0);
                    deferred.resolve(parent);
                });
        },
        function (error) {
           deferred.reject("Display Error: " + error.message);
           console.log("Error: " + error.message);
        }
    );
    return deferred.promise();
}

