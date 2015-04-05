// BACK END SERVICES ONLY, NO UI HERE

var database;
function initializeDB() {
    var deferred = $.Deferred();

    //FIXME only copy on installation, first time, not with each run
    //it is important to remove any old pending file

    if (typeof mac_browser_test === 'undefined') {
        console.log("mac_browser_test is undefined ");

        dbNeedsCopy().done(function (result) {
            if (result === true) {
                //Show Hour glass
                $.mobile.loading("show", {
                    text: "",
                    textVisible: false,
                    theme: "z",
                    html: ""
                });

                window.plugins.sqlDB.remove("sonna.sqlite", removeSuccess, removeError);
                window.plugins.sqlDB.copy("sonna.sqlite", copySuccess, copyError);
            } else {
                OpenMyDatabase();
                doDisplay("", 0);

            }
        });

        //window.localStorage.setItem("db_file_copied", "true");


    } else { //MAC Browser dev mode
        console.log("mac_browser_test = ", mac_browser_test);
        OpenMyDatabase(); //oncopy event will not work
        doDisplay("", 0);
    }

    return deferred.promise();
}

function removeSuccess() {
    console.log(">SUCCESS, removed sonna.sqlite!!!");
}

function removeError() {
    console.log(">ERROR, unable to remove sonna.sqlite!!!");
}

function OpenMyDatabase() {
    //if not the debugger of my MAC
    if (typeof mac_browser_test === 'undefined') {
        //sqlitePlugin: "createFromLocation: 1" NEVER WORKS WITH ME
        database = window.sqlitePlugin.openDatabase({name: "sonna.sqlite"});

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

function copySuccess() {
    console.log(">Success in copying sonna.sqlite");

    OpenMyDatabase();

    var page_id = "0";

    database.transaction(
        function (tx) {

            //Hide Hour glass
            $.mobile.loading("hide", {
                text: "",
                textVisible: false,
                theme: "z",
                html: ""
            });

            doDisplay("", 0);


        },
        function (error) {
            console.log(">Error: " + error.message);
        }
    );

}

function copyError() {
    console.log(">Failed to copy sonna.sqlite!!!");
}

function createTable(tx) {
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

function addSampleData(tx) {

    var ahadith = [
        {
            "page_id": "0",
            "parent_id": "NO_PARENT",
            "book_code": "g2b1",
            "title": "البخاري",
            "page": "البخاري",
            "page_fts": "11 البخاري"
        },
        {
            "page_id": "1",
            "parent_id": "0",
            "book_code": "g2b1",
            "title": "الثاني",
            "page": "body text ## meanings\n word:meanining \n word2:meaning2\n word3: meaning3",
            "page_fts": "11 البخاري"
        },
        {
            "page_id": "2",
            "parent_id": "0",
            "book_code": "g2b1",
            "title": "الثالث",
            "page": "حدثنا",
            "page_fts": "11 البخاري"
        },
        {
            "page_id": "3",
            "parent_id": "2",
            "book_code": "g2b1",
            "title": "Fourth",
            "page": "ابو هريرة",
            "page_fts": "11 كلام من غير تشكيل"
        },
        {
            "page_id": "4",
            "parent_id": "3",
            "book_code": "g2b1",
            "title": "Fifth",
            "page": " بالتشكيل عن عمر بن الخطاب",
            "page_fts": "11 كلام من غير تشكيل"
        },
        {
            "page_id": "5",
            "parent_id": "3",
            "book_code": "g2b1",
            "title": "Six",
            "page": "سمعت رسول",
            "page_fts": "11 الاعمال تاني"
        },
        {
            "page_id": "6",
            "parent_id": "5",
            "book_code": "g2b1",
            "title": "Seven",
            "page": "الله يقول",
            "page_fts": "11 اي حاجه"
        },
        {
            "page_id": "7",
            "parent_id": "5",
            "book_code": "g2b1",
            "title": "Eight",
            "page": "انما الاعمال بالنيات",
            "page_fts": "11 7 الاعمال بالنيات"
        },
        {
            "page_id": "8",
            "parent_id": "5",
            "book_code": "g2b1",
            "title": "More 8",
            "page": "انما 8 بالنيات",
            "page_fts": "11 8 الاعمال بالنيات"
        },
        {
            "page_id": "9",
            "parent_id": "5",
            "book_code": "g2b1",
            "title": "More 9",
            "page": "انما الاعمال بالنيات",
            "page_fts": "11 اما الاعمال بالنيات"
        },
        {
            "page_id": "10",
            "parent_id": "5",
            "book_code": "g2b1",
            "title": "More 10",
            "page": "انما الاعمال بالنيات",
            "page_fts": "11 اما الاعمال بالنيات"
        },
        {
            "page_id": "11",
            "parent_id": "5",
            "book_code": "g2b1",
            "title": "More 11",
            "page": "انما الاعمال بالنيات",
            "page_fts": "11 اما الاعمال بالنيات"
        },
        {
            "page_id": "12",
            "parent_id": "5",
            "book_code": "g2b1",
            "title": "More 12",
            "page": "انما الاعمال بالنيات",
            "page_fts": "11 اما الاعمال بالنيات"
        },
        {
            "page_id": "13",
            "parent_id": "5",
            "book_code": "g2b1",
            "title": "More 13",
            "page": "انما الاعمال بالنيات",
            "page_fts": "11 اما الاعمال بالنيات"
        },
        {
            "page_id": "14",
            "parent_id": "5",
            "book_code": "g2b1",
            "title": "More 14",
            "page": "انما الاعمال بالنيات",
            "page_fts": "11 اما الاعمال بالنيات"
        },
        {
            "page_id": "15",
            "parent_id": "5",
            "book_code": "g2b1",
            "title": "More 15",
            "page": "انما الاعمال بالنيات",
            "page_fts": "11 اما الاعمال بالنيات"
        },        {
            "page_id": "0",
            "parent_id": "NO_PARENT",
            "book_code": "g2b2",
            "title": "مسلم",
            "page": "11      أَنَّ هِرَقْلَ أَرْسَلَ ",
            "page_fts": "11 مسلم"
        },
        {
            "page_id": "1",
            "parent_id": "0",
            "book_code": "g2b2",
            "title": "مسلم",
            "page": "مسلم مسلم",
            "page_fts": "11 مسلم"
        },
        {
            "page_id": "2",
            "parent_id": "0",
            "book_code": "g2b2",
            "title": "الثالث",
            "page": "حدثنا",
            "page_fts": "11 مسلم"
        },
        {
            "page_id": "3",
            "parent_id": "2",
            "book_code": "g2b2",
            "title": "Fourth",
            "page": "ابو هريرة",
            "page_fts": "11 كلام من غير مسلم"
        }

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

//TODO see Contentless FTS4 Tables, http://www.sqlite.org/fts3.html#section_4_1
//FIXME it does not support relevancy ranking, see workaround: http://www.sqlite.org/fts3.html#appendix_a


function getSearchHitsTotalCount(book_code, queryString) {

    var deferred = $.Deferred();
    database.transaction(
        function (tx) {
            var sql = "SELECT count(*) AS total_count FROM pages WHERE book_code = ? AND page_fts MATCH ?";
            var params = [book_code, queryString];
            if(book_code === "") { //empty
                sql = "SELECT count(*) AS total_count FROM pages WHERE page_fts MATCH ?";
                params = [queryString];
            }
            tx.executeSql(sql, params, function (tx, results) {

                var totalHitsCount = results.rows.item(0);
                deferred.resolve(totalHitsCount);
                console.log("Total hits returned are " + totalHitsCount);
            });
        },
        function (error) {
            console.log('>Search ERROR: ' + error.message);
            deferred.reject("Search Error: " + error.message);
        }
    );

    return deferred.promise();
}

function getSearchHits(book_code, queryString, pageSize, pageNo) {
    var deferred = $.Deferred();
    database.transaction(
        function (tx) {
            var sql = "SELECT * FROM pages where book_code = ? AND page_fts MATCH ? LIMIT ? OFFSET ? ";
            var params = [book_code, queryString, pageSize, (pageNo - 1) * pageSize];
            if(book_code === "") {
                sql = "SELECT * FROM pages where page_fts MATCH ? LIMIT ? OFFSET ? ";
                params = [queryString, pageSize, (pageNo - 1) * pageSize];
            }
            tx.executeSql(sql, params, function (tx, results) {
                //Fill Hits Info
                var len = results.rows.length;
                var hits = [];
                for (var i = 0; i < len; i = i + 1) {
                    hits[i] = results.rows.item(i);
                }
                deferred.resolve(hits);
                console.log("Hits returned are " + results.rows.length)
            });
        },
        function (error) {
            console.log('>Search ERROR: ' + error.message);
            deferred.reject("Search Error: " + error.message);
        }
    );


    return deferred.promise();
}

function getDisplay(book_code, page_id) {
    var deferred = $.Deferred();

    //OpenMyDatabase();

    database.transaction(
        function (tx) {
            var sql = "SELECT * FROM pages where book_code = ? AND page_id = ?";
            var params = [book_code, page_id.toString()];
            if(book_code === "") {
                sql = "SELECT * FROM pages where parent_id = 'NO_PARENT'";
                params = []
            }

            tx.executeSql(sql, params, function (tx, results) {
                var len = results.rows.length;
                if(book_code === "") { //display list of books
                    var page = "";
                    for(var i = 0 ; i < len ; i++) {
                        var row = results.rows.item(i);
                        var link = strf('javascript:doDisplay(\"{0}\", {1})', row.book_code, row.page_id);
                        page += strf("<a href=\'{0}\'>{1}</a><br>", link, row.title);
                    }

                } else {
                    var page = results.rows.item(0);
                }

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
            var sql = "SELECT * FROM pages where book_code = ? AND parent_id MATCH ?";
            tx.executeSql(sql, [book_code, page_id], function (tx, results) {
                var len = results.rows.length;
                if (len == 0) {
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
            var sql = "SELECT * FROM pages where book_code = ? AND page_id MATCH ?";
            var nodeId = parent_id;
            tx.executeSql(sql, [book_code, nodeId], function (tx, results) {
                var len = results.rows.length;
                if (len != 1) {
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


//Create database with table, if it exist then no copy needed
function dbNeedsCopy() {
    var deferred = $.Deferred();

//Try to open, if exception happened, then YES

    try {
        database = window.sqlitePlugin.openDatabase({name: "copied.sqlite"});
    } catch (err) {
        deferred.resolve(true);
    }

    //check flag
    database.transaction(
        function (tx) {
            var sql = "SELECT * FROM copied_status";
            tx.executeSql(sql, [],
                function (tx, results) {
                    deferred.resolve(false); //does not need copy
                });
        },
        function (error) {
            //table does not exist; just create it then return
            database.transaction(
                function(tx){
                    tx.executeSql("CREATE TABLE 'copied_status' ('copied' TEXT NOT NULL)");
                },
                function (error) {
                    console.log(">Unable to create table! " + error.message);
                    deferred.resolve(true);
                }
            );

            console.log(">I created the table: " + error.message);
            deferred.resolve(true); //needs copy because generally table does not exist
        }
    );

    return deferred.promise();

}