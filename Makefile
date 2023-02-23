.PHONY: all package test clean

all: package dist/curvature.js

package:
	npx babel source/ --out-dir .

dist/curvature.js: $(shell find source/)
	brunch b

test: dist/curvature.js
	cp dist/curvature.js test/html/
	cp dist/curvature.js.map test/html/
	cd test/ \
	&& rm -rf build/* \
	&& npx babel ./tests/ --out-dir build/tests/ \
	&& npx babel ./*.js --out-dir build \
	&& cd build/ \
	&& cvtest ${TESTLIST}

dependencies:
	npm install

clean:
	rm -rf access animate base form input mixin model net tag service strings node_modules toast dist/* test/html/curvature.js
