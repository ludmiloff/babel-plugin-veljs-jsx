#!/bin/bash
npm pack && tar -xvzf *.tgz && rm -rf package *.tgz
