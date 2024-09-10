.PHONY: all publish test clean post-coverage

SHELL=bash -euo pipefail

MAKEFLAGS+= --no-builtin-rules --warn-undefined-variables

TESTLIST?=

VERSION:=$(shell jq -r .version < package.json)
CV_SOURCES:=$(shell find source/)
CV_TEST_CLASSES=$(wildcard test/*.mjs)
CV_TEST_HELPERS=$(wildcard test/helpers/*.mjs)
CV_TEST_SCRIPTS=$(wildcard test/tests/*.mjs)

ifeq (${CODECOV_TOKEN},)
	CODECOV_DRYFLAG=-d
endif

all: curvature-${VERSION}.tgz dist/curvature.js

# publish: test/results.json curvature-${VERSION}.tgz
# 	npm publish

curvature-${VERSION}.tgz: ${CV_SOURCES} node_modules/.package-lock.json
	@ npx babel source/ --out-dir .
	@ npm pack

dist/curvature.js: ${CV_SOURCES} node_modules/.package-lock.json
	@ npx brunch b -p

dist/curvature.sri: dist/curvature.js
	cat dist/curvature.js | openssl dgst -sha384 -binary | openssl base64 -A | tee dist/curvature.sri

test/html/curvature.js: ${CV_SOURCES} node_modules/.package-lock.json
	@ npx brunch b

test:
	@ echo -e "Testing with \e[33m"`google-chrome --version`"\e[0m...";
	@ rm test/results.json || true
	@ make test/results.json

test/results.json: test/html/curvature.js ${CV_TEST_CLASSES} ${CV_TEST_SCRIPTS} ${CV_TEST_HELPERS}
	@ cd test/ && npx cvtest ${TESTLIST} > ../results.json

test/coverage/data/cv-coverage.json: test/results.json
	@ node test/map-coverage.mjs

test/coverage/data/coverage.xml: test/coverage/data/cv-coverage.json
	@ node test/generate-xml.mjs > test/coverage/data/coverage.xml

node_modules/.package-lock.json: package.json
	@ npm install

post-coverage: codecov test/coverage/data/coverage.xml
	@ BRANCH_NAME=`git branch --show-current` \
	GIT_BRANCH=`git branch --show-current` \
	GIT_COMMIT=`git rev-parse HEAD` \
	CI=local \
	./codecov ${CODECOV_DRYFLAG} \
	-t ${CODECOV_TOKEN} \
	-f test/coverage/data/coverage.xml

post-images: test/results.json
	@ ls test/screenshots | while read SCREENSHOT; do { \
		echo $$SCREENSHOT; \
		SS_PATH="$$(basename $$SCREENSHOT)"; \
		curl -sX POST "https://imgur.com/upload" \
			-H "Referer: http://imgur.com/upload" \
			-F "Filedata=@\"test/screenshots/$$SS_PATH\";filename=$$SCREENSHOT;type=image/png" \
		| jq -r '"https://imgur.com/\(.data.hash)"'; \
	} done | tee test/screenshots/list;
	@ cat test/screenshots/list;

codecov:
	@ curl -O https://uploader.codecov.io/latest/linux/codecov
	@ chmod +x codecov

clean:
	rm -rf access animate base form input mixin model net tag \
	service strings toast dist/* test/html/curvature.js test/build/* \
	test/html/curvature.js.map test/coverage/v8/* test/coverage/html/*.html \
	curvature-${VERSION}.tgz test/results.json \
	test/coverage/data/coverage.xml test/coverage/data/cv-coverage.json \
	test/screenshots/*.png test/screenshots/list
