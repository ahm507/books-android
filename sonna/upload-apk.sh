#!/usr/bin/env bash

echo

cp ./platforms/android/ant-build/MainActivity-debug.apk ./sonna.0.3.apk
rsync -avzhe ssh  ./sonna.0.3.apk root@107.170.121.44:/var/lib/tomcat7/webapps/ROOT
rm ./sonna.0.3.apk

echo "Please download from URL:"
echo "http://107.170.121.44/sonna.0.3.apk"
echo

