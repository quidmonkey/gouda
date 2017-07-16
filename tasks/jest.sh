#!/bin/bash

rm -rf .gouda-test/*
node test.js --framework jest $@
node node_modules/jest/bin/jest.js .gouda-test/**/*.spec.js
