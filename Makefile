.PHONY: build build-package build-min build-dist build-prod clean

build: build-package build-dist build-min

build-package:
	npx babel source/ --out-dir .

build-dist:
	NODE_ENV=prod npx babel source/ --no-comments --out-file dist/curvature.js
	NODE_ENV=prod npx babel source/base --no-comments --out-file dist/curvature.base.js

build-min:
	NODE_ENV=prod-min npx babel source/ --no-comments --out-file dist/curvature.min.js
	NODE_ENV=prod-min npx babel source/base --no-comments --out-file dist/curvature.base.min.js

dependencies:
	npm install

clean:
	rm -rf access base form input mixin model tag strings node_modules toast dist/*
