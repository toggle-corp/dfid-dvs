#!/bin/bash

yarn build
cd build
mv index.html 200.html
surge -d dfid-dvs.surge.sh
