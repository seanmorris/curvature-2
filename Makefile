.PHONY: all publish test clean post-coverage

SHELL=bash -euo pipefail

CV_SOURCES:=$(shell find source/)
VERSION:=$(shell jq -r .version < package.json)

ifeq (${CODECOV_TOKEN},)
	CODECOV_DRYFLAG=-d
endif

all: dist/curvature.js test/html/curvature.js curvature-${VERSION}.tgz

# publish: test/results.json curvature-${VERSION}.tgz
# 	npm publish

curvature-${VERSION}.tgz: ${CV_SOURCES} node_modules/.package-lock.json
	npx babel source/ --out-dir .
	npm pack

dist/curvature.js: ${CV_SOURCES} node_modules/.package-lock.json
	npx brunch b -p

test/html/curvature.js: ${CV_SOURCES} node_modules/.package-lock.json
	npx brunch b

test:
	echo -e "\e[33m"`google-chrome --version`"\e[0m";
	touch -d 0 test/results.json
	make test/results.json

test/results.json: test/html/curvature.js
	cd test/ \
	&& rm -rf build/* \
	&& npx babel ./helpers/ --out-dir build/helpers/ \
	&& npx babel ./tests/ --out-dir build/tests/ \
	&& npx babel ./*.js --out-dir build \
	&& cd build/ \
	&& npx cvtest ${TESTLIST} > ../results.json

test/coverage/data/cv-coverage.json: test/results.json test/html/curvature.js
	node test/map-coverage.js

test/coverage/data/coverage.xml: test/coverage/data/cv-coverage.json
	node test/generate-xml.js > test/coverage/data/coverage.xml

node_modules/.package-lock.json: package.json
	npm install

post-coverage: codecov test/coverage/data/coverage.xml
	BRANCH_NAME=`git branch --show-current` \
	GIT_BRANCH=`git branch --show-current` \
	GIT_COMMIT=`git rev-parse HEAD` \
	CI=local \
	./codecov ${CODECOV_DRYFLAG} -v \
	-t ${CODECOV_TOKEN} \
	-f test/coverage/data/coverage.xml

post-images: test/results.json
	ls test/screenshots | while read SCREENSHOT; do { \
		echo $$SCREENSHOT; \
		SS_PATH="$$(basename $$SCREENSHOT)"; \
		curl -sX POST "https://imgur.com/upload" \
			-H "Referer: http://imgur.com/upload" \
			-F "Filedata=@\"test/screenshots/$$SS_PATH\";filename=$$SCREENSHOT;type=image/png" \
		| jq -r '"https://imgur.com/\(.data.hash)"'; \
	} done | tee test/screenshots/list;
	cat test/screenshots/list;

codecov:
	curl -O https://uploader.codecov.io/latest/linux/codecov
	chmod +x codecov

clean:
	rm -rf access animate base form input mixin model net tag \
	service strings toast dist/* test/html/curvature.js test/build/* \
	test/html/curvature.js.map test/coverage/v8/* test/coverage/html/*.html \
	codecov curvature-${VERSION}.tgz test/results.json
