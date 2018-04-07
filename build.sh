#!/usr/bin/env bash

DIR=`pwd`/$0;
DIR=`dirname $DIR`/;

pushd $DIR;

ln -s .source/ app

brunch build;

rm app;