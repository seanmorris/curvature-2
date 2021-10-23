.PHONY: all package min dist prod clean

all: package

package:
	npx babel source/ --out-dir .

# dist:
# 	NODE_ENV=prod npx babel source/ --no-comments --out-file dist/curvature.js
# 	NODE_ENV=prod npx babel source/base --no-comments --out-file dist/curvature.base.js

# min:
# 	NODE_ENV=prod-min npx babel source/ --no-comments --out-file dist/curvature.min.js
# 	NODE_ENV=prod-min npx babel source/base --no-comments --out-file dist/curvature.base.min.js

dependencies:
	npm install

clean:
	rm -rf access animate base form input mixin model tag strings node_modules toast dist/*
