.PHONY: all publish test clean post-coverage

CV_SOURCES:=$(shell find source/)
SHELL=bash -euxo pipefail

ifeq (${CODECOV_TOKEN},)
 CODECOV_DRYFLAG=-d
endif

all: dist/curvature.js test/html/curvature.js curvature-0.0.68-h.tgz

publish: test curvature-0.0.68-h.tgz
	npm publish

curvature-0.0.68-h.tgz: node_modules/.package-lock.json ${CV_SOURCES}
	npx babel source/ --out-dir .
	npm pack

dist/curvature.js: node_modules/.package-lock.json ${CV_SOURCES}
	npx brunch b -p

test/html/curvature.js: node_modules/.package-lock.json ${CV_SOURCES}
	npx brunch b

test: node_modules/.package-lock.json ${CV_SOURCES} test/html/curvature.js
	cd test/ \
	&& rm -rf build/* \
	&& npx babel ./helpers/ --out-dir build/helpers/ \
	&& npx babel ./tests/ --out-dir build/tests/ \
	&& npx babel ./*.js --out-dir build \
	&& cd build/ \
	&& cvtest ${TESTLIST} \

test/coverage/data/cv-coverage.json:
	node test/map-coverage.js

test/coverage/data/coverage.xml: test/coverage/data/cv-coverage.json
	node test/generate-xml.js > test/coverage/data/coverage.xml

node_modules/.package-lock.json: package.json
	npm install

post-coverage: codecov test test/coverage/data/coverage.xml
	BRANCH_NAME=`git branch --show-current` \
	GIT_BRANCH=`git branch --show-current` \
	GIT_COMMIT=`git rev-parse HEAD` \
	CI=local \
	./codecov ${CODECOV_DRYFLAG} -v \
	-t ${CODECOV_TOKEN} \
	-f test/coverage/data/coverage.xml

codecov:
	curl -O https://uploader.codecov.io/latest/linux/codecov
	chmod +x codecov

clean:
	rm -rf access animate base form input mixin model net tag \
	service strings toast dist/* test/html/curvature.js test/build/* \
	test/html/curvature.js.map test/coverage/v8/* test/coverage/html/*.html \
	codecov
