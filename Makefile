.PHONY: all package min dist test clean

all: package dist

package:
	npx babel source/ --out-dir .

dist/curvature.js: source/
	brunch b || true

test: dist/curvature.js
	cp dist/curvature.js test/html/
	cd test/ \
	&& npx babel ./ ./tests  --out-dir build \
	&& cd build/ \
	&& cvtest \

dependencies:
	npm install

clean:
	rm -rf access animate base form input mixin model tag strings node_modules toast dist/*
