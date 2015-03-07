#!/usr/bin/env bash

# Create project workshop
folder=sonna
class=Sonna
cordova create $folder com.hammad.workshop $class

cd $folder

#Add ios support
cordova platforms add ios

# Add android support
cordova platforms add android

#install basic plugins to your project
cordova plugin add org.apache.cordova.device
cordova plugin add org.apache.cordova.console

# Handle dialogs instead of javascript dialogs that show your app is not native
cordova plugin add org.apache.cordova.dialogs

# add existing sqlite
cordova plugin add com.triarc.sqliteplugin
