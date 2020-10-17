.PHONY: build build-prod clean

build:
	npx babel source/ --out-dir .

build-prod:
	npx babel source/ --no-comments --out-file dist/curvature.js
	npx babel source/ --presets=babel-preset-minify --no-comments --out-file dist/curvature.min.js

dependencies:
	npm install

clean:
	rm -rf access base form input tag node_modules toast dist/*
