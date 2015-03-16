#!/usr/bin/env bash

echo "hardsecure202"
#rsync -avzhe ssh --exclude-from './rsync-exclude.txt' ../ root@188.166.21.10:/var/www/FamilyWeb/remove

cp ./platforms/android/ant-build/MainActivity-debug.apk ./sonna.0.2.apk
rsync -avzhe ssh  ./sonna.0.2.apk root@188.166.21.10:/var/www/FamilyWeb/src/remove/
rm ./sonna.0.2.apk



