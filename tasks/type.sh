#!/bin/bash

rm -rf .gouda/*
node type.js $@
npm run flow
