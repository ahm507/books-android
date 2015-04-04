"use strict";

function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

function guid(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
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


function replaceAll(string, find, replace) {
    return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}


function shortenText(text, wordsCount) {
    //    var wordArray = text.split(' ').slice(0,wordsCount).join(' ');
    var wordArray = text.split(' ');
    if (wordArray.length <= wordsCount) {
        return text; //no shortening needed
    }
    var newText = wordArray.slice(0, wordsCount).join(' ');
    return newText + " ...";
}

function stripHtml(htmlText) {
    return $(htmlText).text();
//    return text.replace(/<\/?[^>]+(>|$)/g, "");
}

function fillQueryParameters() {
     var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;

}

//Not used currently
function validator() {
    var invalid = "abcdefghijklmnopqrstuvwxyzABCDEFJHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()+=-[]\\\';,./{}|\":<>?";
    for (var i = 0; i < invalid.length; ++i)
        if (value.indexOf(invalid[i]) >= 0)
            return 'يسمح فقط بالحروف العربية';
}


function getSpaces(n) {
    n = n * 2;
    var spaces = "";
    for (var i = 0; i < n; i++) {
        spaces += "&nbsp;";
    }
    return spaces
}
