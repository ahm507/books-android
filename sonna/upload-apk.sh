#!/usr/bin/env bash

echo

cp ./platforms/android/ant-build/MainActivity-debug.apk ./sonna.0.8.apk
rsync -avzhe ssh  ./sonna.0.8.apk root@107.170.121.44:/var/lib/tomcat7/webapps/finance
rm ./sonna.0.8.apk

echo "Please download from URL:"
echo "http://107.170.121.44:8080/finance/sonna.0.8.apk"
echo

