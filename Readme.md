
Publishing Books Android App
=============================



Technology
----------

* This is Cordova application that uses Jquery Mobile and Sqlite to display and search
book contents.
    * Cordova enabled me to do multi-platform development with minimum hassle.
    * JQUeryMobile is really a nice framework that enables me to reuse the GUI code on the web if I need.
    * Sqlite is distributed with Andorid and iPhone, so it is good data store with full text indexing; hint: the 
    sqlite FTS does not support ranking results out of the box. 
     
* It uses PyCharm IDE, however, it is not needed at all.
    * You can use whatever IDE, I used and liked the command line interface of cordova,
    see shell files under ./sonna/ folder. 


License
--------
* The code currently has me only as a creator and contributor, however, usage and contributions are welcomed.
* The text and code is license as GNU 3.0 located at: https://www.gnu.org/copyleft/gpl.html


Installation
-------------
* Read sonna/install.sh for comments on pre-requisites.

* Add ios support

        cordova platforms add ios

* Add android support

        cordova platforms add android

* install basic plugins to your project

        cordova plugin add org.apache.cordova.device

* install console logging support

        cordova plugin add org.apache.cordova.console

* Handle dialogs instead of javascript dialogs that show your app is not native

        cordova plugin add org.apache.cordova.dialogs

* add existing sqlite

        cordova plugin add com.triarc.sqliteplugin

* plugin to copy the sqlite db file

        cordova plugin add https://github.com/an-rahulpandey/cordova-plugin-dbcopy.git

