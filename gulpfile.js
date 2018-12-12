let fs			  = require( "fs" ),
	gulp          = require( "gulp" ),
	gutil         = require( "gulp-util" ),
	scss          = require( "gulp-sass" ),
	typescript 	  = require( "gulp-tsc" ),
	concat        = require( "gulp-concat" ),
	uglify        = require( "gulp-uglify" ),
	cleancss      = require( "gulp-clean-css" ),
	rename        = require( "gulp-rename" ),
	autoprefixer  = require( "gulp-autoprefixer" ),
	notify        = require( "gulp-notify" ),
	gcmq          = require( "gulp-group-css-media-queries" ), // На любителя, мне не сильно пригодилось, но штука красит код
	htmlmin		  = require( "gulp-htmlmin" ); // Рудимент, пусть будет на память.

function styles() {
	return gulp.src( "style.scss" )
		.pipe( scss( { outputStyle: "expand" } ).on( "error", notify.onError() ) )
		.pipe( rename( { suffix: ".min", prefix : "" }))
		.pipe( autoprefixer( [ "last 15 versions" ] ).on( "error", notify.onError() ) )
		.pipe( cleancss( { level: { 1: { specialComments: 0 } } } ).on( "error", notify.onError() ) ) // Opt., comment out when debugging
		.pipe( gulp.dest( "." ) );
}

function ts() {
	return gulp.src( "js/scripts.ts" )
		.pipe( typescript().on( "error", notify.onError() ) )
		.pipe( gulp.dest( "js" ) );
}

function js() {
	return gulp.src( [
			"node_modules/axios/dist/axios.min.js",

			"node_modules/inputmask/dist/min/inputmask/dependencyLibs/inputmask.dependencyLib.min.js",
			"node_modules/inputmask/dist/min/inputmask/inputmask.min.js",
			"node_modules/inputmask/dist/min/inputmask/inputmask.extensions.min.js",
			"node_modules/inputmask.phone/dist/min/inputmask.phone/inputmask.phone.extensions.min.js",

			"node_modules/photoswipe/dist/photoswipe.min.js",
			"node_modules/photoswipe/dist/photoswipe-ui-default.min.js",

			"node_modules/swiper/dist/js/swiper.min.js",

			"js/scripts.js", // Always at the end
		] )
		.pipe( concat( "scripts.min.js" ) )
		.pipe( uglify().on( "error", notify.onError() ) ) // Mifify js (opt.) - mifify hahaha
		.pipe( gulp.dest( "." ) );
}

function watchFiles() {
	gulp.watch( "**/*.scss", styles );
	gulp.watch( "js/scripts.ts", ts );
	gulp.watch( "js/scripts.js", js );

	fs.watchFile( "style.min.css", {
		interval: 100
	}, ( current, previous ) => {
		if ( current.size == 0 ) {
			gulp.parallel( styles );
		}
	} );

	fs.watchFile( "scripts.min.js", {
		interval: 100
	}, ( current, previous ) => {
		if ( current.size == 0 ) {
			gulp.parallel( js );
		}
	} );
}

gulp.task( "watch", gulp.parallel( watchFiles ) );
