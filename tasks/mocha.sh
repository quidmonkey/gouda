#!/bin/bash

rm -rf .gouda-test/*
node test.js --framework mocha $@
node_modules/mocha/bin/mocha .gouda-test/**/*.spec.js --timeout 5000
