.PHONY: build build-prod clean

build:
	npx babel source/ --out-dir .

build-prod:
	npx babel source/ --out-file .dist/curvature.js

dependencies:
	npm install

clean:
	rm -rf access base form input tag node_modules toast index.js dist/*
