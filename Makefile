INCLUDES = $(CURDIR)/includes/scripts/
ISOTOPE = ${INCLUDES}"isotope/jquery.isotope.min.js"
FLEXSLIDER = ${INCLUDES}"flexslider/jquery.flexslider-min.js"
SHADOWBOX = ${INCLUDES}"shadowbox/shadowbox.js"
GENERAL = $(CURDIR)/js/general.js
INPUT = ${ISOTOPE} ${FLEXSLIDER} ${SHADOWBOX} ${GENERAL}
BUILD_JS = ./js/build.js
BUILD_JS_MIN = ./js/build.min.js
CHECK=\033[32m✔\033[39m
HR=\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#

build: build-js build-css
	
	
build-js:
	@echo "\n${HR}";
	@echo "Compiling js files"
	@uglifyjs --comments=all ${INPUT} -bo ${BUILD_JS}
	@echo "Compressing js files"
	@uglifyjs ${BUILD_JS} -co ${BUILD_JS_MIN}
	@echo "\n${HR}";
	

build-css:
	@make -C less/