// BACK END SERVICES ONLY, NO UI HERE
var PageService = function () {

//FIXME onDeviceReady issue

    this.initialize = function () {
        var deferred = $.Deferred();
//      this.db = window.sqlitePlugin.openDatabase({name:"sqlite.db"});
//      See https://github.com/brodysoft/Cordova-SQLitePlugin
        this.db = window.openDatabase("sqlite", "1.0", "Employee Demo DB", 200000);
        this.db.transaction(
            function (tx) {
                createTable(tx);
                addSampleData(tx);
            },
            function (error) {
                console.log('Transaction error: ' + error);
                deferred.reject('Transaction error: ' + error);
            },
            function () {
                console.log('DB init success');
                deferred.resolve();
            }
        );

        return deferred.promise();
    }

    this.search = function (queryString) {
        var deferred = $.Deferred();
        this.db.transaction(
            function (tx) {
                var sql = "SELECT * FROM pages where page MATCH '" + queryString + "'";
                tx.executeSql(sql, [], function (tx, results) {
                    //Fill Hits Info
                    var len = results.rows.length,
                        hits = [], i = 0;
                    for (; i < len; i = i + 1) {
                        hits[i] = results.rows.item(i);
                    }
                    //Display Hits
                    len = hits.length;
                    i = 0;
                    for (; i < len; i = i + 1) {
                        console.log(hits[i].book_code + ", " + hits[i].page + ", " + hits[i].page_fts);

                        $('.hits-list').empty();
                        for (var i = 0; i < len; i++) {
                            e = hits[i];
                            $('.hits-list').append('<li><a href="#employees/' + e.id + '">' + e.page + ' ' + e.page_fts + '</a></li>');
                        }
                    }

//                    deferred.resolve(hits);
//                    alert("rows returned are " + results.rows.length)
//                    console.log('rows returned: ' + results[0].book_code);
                });
            },
            function (error) {
//               deferred.reject("Transaction Error: " + error.message);
                 alert(error.message);
            }
        );
        return deferred.promise();
    }

    this.display = function (book_code, page_id) {
        var deferred = $.Deferred();
        this.db.transaction(
            function (tx) {
                var sql = "SELECT * FROM pages where page_id MATCH ?";
                tx.executeSql(sql, [page_id], function (tx, results) {

                    var len = results.rows.length;
                    if(len != 1) {
                        //I expect an end of ids
//                        alert("Invalid book or page!");
                        console.log('results != 1 !!! , len=' + len);
                        return;
                    }

                    page = results.rows.item(0);
                    console.log("displaying book_code:" + page.book_code + ", page_id: " + page.page_id);

                    $.cookie("book_code", page.book_code);
                    $.cookie("page_id", page.page_id);

                    $('.page').empty();
                    $('.page').append(page.page);
                    $('.page_fts').empty();
                    $('.page_fts').append(page.page_fts);

//                  deferred.resolve(hits);
//                  alert("rows returned are " + results.rows.length)
//                  console.log('rows returned: ' + results[0].book_code);
                });
            },
            function (error) {
//               deferred.reject("Transaction Error: " + error.message);
                 alert(error.message);
            }
        );
        return deferred.promise();
    }

    var createTable = function (tx) {
        tx.executeSql('DROP TABLE IF EXISTS pages');
        var sql = "CREATE VIRTUAL TABLE pages USING fts3( " +
            "page_id, parent_id, book_code, page, page_fts);";
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
            {"page_id": "0", "parent_id": "-1", "book_code": "g2b1", "page": "أَبَا سُفْيَانَ بْنَ حَرْبٍ أَخْبَرَهُ أَنَّ هِرَقْلَ أَرْسَلَ ", "page_fts": "قال" },
            {"page_id": "1", "parent_id": "0", "book_code": "g2b1", "page": "البخاري", "page_fts": "البخاري" },
            {"page_id": "2", "parent_id": "0", "book_code": "g2b1", "page": "حدثنا", "page_fts": "البخاري" },
            {"page_id": "3", "parent_id": "2", "book_code": "g2b1", "page": "ابو هريرة", "page_fts": "كلام من غير تشكيل" },
            {"page_id": "4", "parent_id": "3", "book_code": "g2b1", "page": " بالتشكيل عن عمر بن الخطاب", "page_fts": "كلام من غير تشكيل" },
            {"page_id": "5", "parent_id": "3", "book_code": "g2b1", "page": "سمعت رسول", "page_fts": "الاعمال تاني" },
            {"page_id": "6", "parent_id": "5", "book_code": "g2b1", "page": "الله يقول", "page_fts": "اي حاجه" },
            {"page_id": "7", "parent_id": "5", "book_code": "g2b1", "page": "انما الاعمال بالنيات", "page_fts": "اما الاعمال بالنيات" }
        ];
        var l = employees.length;
        var sql = "INSERT OR REPLACE INTO pages " +
            "(page_id, parent_id, book_code, page, page_fts) " +
            "VALUES (?, ?, ?, ?, ?)";
        var e;
        for (var i = 0; i < l; i++) {
            e = employees[i];
            tx.executeSql(sql, [e.page_id, e.parent_id, e.book_code, e.page, e.page_fts],
                function () {
                    console.log('INSERT success');
                },
                function (tx, error) {
    //                    alert('INSERT error: ' + error.message);
                    console.log('INSERT error: ' + error.message);

                });
        }
    }


}