CLANG_FORMAT=node_modules/clang-format/bin/linux_x64/clang-format --style=Google
CSS_VALIDATOR=node_modules/css-validator/bin/css-validator
ESLINT=node_modules/eslint/bin/eslint.js
HTML_VALIDATE=node_modules/html-validate/bin/html-validate.js
PRETTIER=node_modules/prettier/bin-prettier.js

JAVA = $(shell find project/backend/src/main/java -iname "*.java")
HTML = $(shell find project/frontend/src -name "*.html") $(shell find project/backend/src/main/webapp -name "*.html")
CSS = $(shell find project/frontend/src -name "*.css") $(shell find project/backend/src/main/webapp -name "*.css")
JS = $(shell find project/frontend/src -name "*.js") $(shell find project/backend/src/main/webapp -name "*.js")

node_modules:
	npm install clang-format prettier css-validator html-validate eslint eslint-config-google

pretty: node_modules
	$(PRETTIER) --write $(HTML) $(CSS)
	$(CLANG_FORMAT) -i $(JAVA)
	$(CLANG_FORMAT) -i $(JS)

validate: node_modules
	$(HTML_VALIDATE) $(HTML)
	$(CSS_VALIDATOR) $(CSS)
	$(ESLINT) $(JS)

package:
	mvn package
