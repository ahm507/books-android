#!/usr/bin/env bash

#cordova run ios

./prepare.sh
cordova run android
./cleanup.sh