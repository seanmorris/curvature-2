.PHONY: build build-prod clean

build:
	npx babel .source --presets=@babel/preset-env --out-dir .

build-prod:
	npx babel .source --presets=@babel/preset-env --out-file .dist/curvature.js

dependencies:
	npm install

clean:
	rm -rf base form input tag node_modules toast Config.js index.js .dist/*
