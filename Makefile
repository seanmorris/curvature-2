.PHONY: all package test clean post-coverage

CV_SOURCES:=$(shell find source/)
SHELL=bash -euxo pipefail

all: dist/curvature.js test/html/curvature.js curvature-0.0.68-h.tgz

curvature-0.0.68-h.tgz: node_modules/.package-lock.json ${CV_SOURCES}
	npx babel source/ --out-dir .
	npm pack

dist/curvature.js: node_modules/.package-lock.json ${CV_SOURCES}
	brunch b -p

test/html/curvature.js: node_modules/.package-lock.json ${CV_SOURCES}
	brunch b

test: node_modules/.package-lock.json ${CV_SOURCES} test/html/curvature.js
	cd test/ \
	&& rm -rf build/* \
	&& npx babel ./helpers/ --out-dir build/helpers/ \
	&& npx babel ./tests/ --out-dir build/tests/ \
	&& npx babel ./*.js --out-dir build \
	&& cd build/ \
	&& cvtest ${TESTLIST} \
	&& cd ../../ \
	&& node test/map-coverage.js

node_modules/.package-lock.json: package.json
	npm install

clean:
	rm -rf access animate base form input mixin model net tag \
	service strings toast dist/* test/html/curvature.js \
	test/html/curvature.js.map test/coverage/v8/* test/coverage/html/*.html

post-coverage:
	echo codecov -v -d \
	-t TOKEN_HERE \
	-B `git branch --show-current` \
	-C `git rev-parse HEAD` \
	-f test/coverage/json/simplecov.json
