#!/bin/bash

npm run type -- $@
# npm run ava
npm run jest -- $@
npm run jasmine -- $@
npm run mocha -- $@
