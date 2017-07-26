#!/bin/bash

rm -rf .gouda-test/*
node test.js --framework jasmine $@
npm run jasmine-test -- .gouda-test/**/*.spec.js
