#!/bin/bash

rm -rf .gouda-test/*
node test.js --framework ava $@
node node_modules/ava/cli.js .gouda-test/**/*.spec.js
