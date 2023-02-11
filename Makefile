.PHONY: all package test clean

all: package dist/curvature.js

package:
	npx babel source/ --out-dir .

dist/curvature.js: $(shell find source/)
	brunch b -p

test: dist/curvature.js
	cp dist/curvature.js test/html/
	cd test/ \
	&& rm -rf build/* \
	&& npx babel ./tests/ --out-dir build/tests/ \
	&& npx babel ./*.js --out-dir build \
	&& cd build/ \
	&& cvtest ${TESTLIST}

dependencies:
	npm install

clean:
	rm -rf access animate base form input mixin model tag strings node_modules toast dist/*
