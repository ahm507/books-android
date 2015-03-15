// BACK END SERVICES ONLY, NO UI HERE
var PageService = function () {

//FIXME onDeviceReady issue

    this.initialize = function () {
        var deferred = $.Deferred();
//      See https://github.com/brodysoft/Cordova-SQLitePlugin
//FIXME make a programatic switch between browser mode and emulator/device mode
        //sqlitePlugin runs only in Emulator or real device
        console.log(">Copying sonna.sqlite to native device location");
//        window.plugins.sqlDB.copy("sonna.sqlite", copySuccess, copyError);

        //it is important to remove any old pending file
        window.plugins.sqlDB.remove("sonna.sqlite", removeSuccess, removeError);
//        window.plugins.sqlDB.copy("sonna.sqlite", this.copySuccess, copyError);
//        this.db = window.openDatabase("sqlite", "1.0", "sqlite", 20000000);
//        this.db.transaction(
//            function (tx) {
//                createTable(tx);
//                addSampleData(tx);
//            },
//            function (error) {
//                console.log('Transaction error: ' + error);
//                deferred.reject('Transaction error: ' + error);
//            },
//            function () {
//                console.log('DB init success');
//                deferred.resolve();
//            }
//        );

        return deferred.promise();
    }

    function copySuccess() {
//    this.copySuccess = function() {
        console.log(">Success in copying sonna.sqlite");
        alert(">Success in copying sonna.sqlite");
        //sqlitePlugin: "createFromLocation: 1" NEVER WORKS WITH ME
        this.db = window.sqlitePlugin.openDatabase({name:"sonna.sqlite"});

//        doDisplay("g2b1", "0");

            var page_id = "0";

            this.db.transaction(
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
                        console.log(">Displaying initial page");
//                      $.cookie("book_code", page.book_code);
//                      $.cookie("page_id", page.page_id);
                        //cookies are not supported
                        window.localStorage.setItem("book_code", page.book_code);
                        window.localStorage.setItem("page_id", page.page_id);

                        $('.article-title').empty();
                        $('.article-title').append(page.title);

                        $('.page').empty();
                        $('.page').append(page.page);
                        $('.page_fts').empty();
                        $('.page_fts').append(page.page_fts);

//                        deferred.resolve(page);
    //                  alert("rows returned are " + results.rows.length)
    //                  console.log('rows returned: ' + results[0].book_code);
                    });
                },
                function (error) {
//                   deferred.reject("Display Error: " + error.message);
                   console.log(">Error: " + error.message);
                }
            );

//
////        this.display("g2b1", "0").done(function (page) {
//
//            $.cookie("book_code", page.book_code);
//            $.cookie("page_id", page.page_id);
//
//            $('.article-title').empty();
//            $('.article-title').append(page.title);
//
//            $('.page').empty();
//            $('.page').append(page.page);
//            $('.page_fts').empty();
//            $('.page_fts').append(page.page_fts);



//            doTabweeb (page.title, book_code, page_id, page.parent_id);

//        });


    }


    function copyError() {
        console.log(">Failed to copy sonna.sqlite!!!");
        alert(">Failed to copy sonna.sqlite!!!");
    }



    function removeSuccess() {
        console.log(">SUCCESS, removed sonna.sqlite!!!");
        alert(">SUCCESS, removed sonna.sqlite!!!");

        window.plugins.sqlDB.copy("sonna.sqlite", this.copySuccess, copyError);

    }

    function removeError() {
        console.log(">ERROR, unable to remove sonna.sqlite!!!");
        alert(">ERROR, unable to remove sonna.sqlite!!!");

        window.plugins.sqlDB.copy("sonna.sqlite", this.copySuccess, copyError);

    }


    var createTable = function (tx) {
        tx.executeSql('DROP TABLE IF EXISTS pages');
        var sql = "CREATE VIRTUAL TABLE pages USING fts3( " +
            "page_id, parent_id, book_code, title, page, page_fts);";
        tx.executeSql(sql, null,
            function () {
                console.log('Create table success');
            },
            function (tx, error) {
                alert('Create table error: ' + error.message);
            });
        }

    var addSampleData = function (tx, employees) {

        var employees = [
            {"page_id": "0", "parent_id": "NO_PARENT", "book_code": "g2b1", "title":"الأول", "page": "أَبَا سُفْيَانَ بْنَ حَرْبٍ أَخْبَرَهُ أَنَّ هِرَقْلَ أَرْسَلَ ", "page_fts": "قال" },
            {"page_id": "1", "parent_id": "0", "book_code": "g2b1", "title":"الثاني", "page": "البخاري", "page_fts": "البخاري" },
            {"page_id": "2", "parent_id": "0", "book_code": "g2b1", "title":"الثالث", "page": "حدثنا", "page_fts": "البخاري" },
            {"page_id": "3", "parent_id": "2", "book_code": "g2b1", "title":"Fourth", "page": "ابو هريرة", "page_fts": "كلام من غير تشكيل" },
            {"page_id": "4", "parent_id": "3", "book_code": "g2b1", "title":"Fifth", "page": " بالتشكيل عن عمر بن الخطاب", "page_fts": "كلام من غير تشكيل" },
            {"page_id": "5", "parent_id": "3", "book_code": "g2b1", "title":"Six", "page": "سمعت رسول", "page_fts": "الاعمال تاني" },
            {"page_id": "6", "parent_id": "5", "book_code": "g2b1", "title":"Seven", "page": "الله يقول", "page_fts": "اي حاجه" },
            {"page_id": "7", "parent_id": "5", "book_code": "g2b1", "title":"Eight", "page": "انما الاعمال بالنيات", "page_fts": "اما الاعمال بالنيات" }
        ];
        var l = employees.length;
        var sql = "INSERT OR REPLACE INTO pages " +
            "(page_id, parent_id, book_code, title, page, page_fts) " +
            "VALUES (?, ?, ?, ?, ?, ?)";
        var e;
        for (var i = 0; i < l; i++) {
            e = employees[i];
            tx.executeSql(sql, [e.page_id, e.parent_id, e.book_code, e.title, e.page, e.page_fts],
                function () {
                    console.log('INSERT success');
                },
                function (tx, error) {
    //                    alert('INSERT error: ' + error.message);
                    console.log('INSERT error: ' + error.message);

                });
        }
    }

    this.search = function (queryString) {
        var deferred = $.Deferred();
        this.db.transaction(
            function (tx) {
                var sql = "SELECT * FROM pages where page_fts MATCH '" + queryString + "'";
                tx.executeSql(sql, [], function (tx, results) {
                    //Fill Hits Info
                    var len = results.rows.length,
                        hits = [], i = 0;
                    for (; i < len; i = i + 1) {
                        hits[i] = results.rows.item(i);
                    }

                    deferred.resolve(hits);
                    console.log("hits returned are " + results.rows.length)
                });
            },
            function (error) {
                console.log('>ERROR: ' + error.message);
                deferred.reject("Transaction Error: " + error.message);
            }
        );
        return deferred.promise();
    }

    this.display = function (book_code, page_id) {
        var deferred = $.Deferred();

        this.db = window.sqlitePlugin.openDatabase({name:"sonna.sqlite"});

        this.db.transaction(
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
//                  alert("rows returned are " + results.rows.length)
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

    this.getKidsNodes = function (book_code, page_id) {
        var deferred = $.Deferred();
        this.db.transaction(
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
    this.getParentNode = function (book_code, page_id, parent_id) {
        var deferred = $.Deferred();
        this.db.transaction(
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



}