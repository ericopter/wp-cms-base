LESS = ./build.less
CSS = ../css/build.css
CSS_MIN = ../css/build.min.css
RESPONSIVE_LESS = ./grid-responsive.less
RESPONSIVE_CSS = ../css/responsive.css
RESPONSIVE_CSS_MIN = ../css/responsive.min.css
CHECK=\033[32m✔\033[39m
HR=\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#

build: build-css responsive
	
build-css:
	@echo "\n${HR}"
	@echo "Compiling Skeleton from Less...             ${CHECK} Done"
	@recess --compile ${LESS} > ${CSS}
	@recess --compress ${LESS} > ${CSS_MIN}
	@echo "${HR}"

responsive:
	@echo "\n${HR}"
	@echo "Compiling responsive stylesheet...          ${CHECK} Done"
	@recess --compile ${RESPONSIVE_LESS} > ${RESPONSIVE_CSS}
	@recess --compress ${RESPONSIVE_LESS} > ${RESPONSIVE_CSS_MIN}
	@echo "${HR}"