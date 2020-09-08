.PHONY: build build-prod clean

build:
	npx babel .source --out-dir .

build-prod:
	npx babel .source --out-file .dist/curvature.js

dependencies:
	npm install

clean:
	rm -rf base form input tag node_modules toast Config.js index.js .dist/*
