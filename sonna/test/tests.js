QUnit.test( "Test replace new line", function( assert ) {

    //var str = "def=something\\ndef2=some thing else\\n";
    //var str2 = str.replace(/\\n/g, "\\n<br>");
    //assert.equals( "def=something\\n<br>def2=some thing else\\n<br>", str2);

    var str = "word1 \n word2";
    var res = str.split("\n").join("<br>")
    assert.equal("word1 <br> word2",  res);

});

//QUnit.test( "hello test2", function( assert ) {
//  assert.equal(2,  sum(1, 1));
//  assert.equal(4,  sum(2, 2));
//});
