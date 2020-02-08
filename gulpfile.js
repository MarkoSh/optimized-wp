const {
	parallel, 
	src, 
	dest
} 				= require( 'gulp' );
const gulp		= require( 'gulp' );

const babel 	= require( 'gulp-babel' );
const uglify 	= require( 'gulp-uglify' );
const rename 	= require( 'gulp-rename' );

const sass		= require( 'gulp-sass' );
const autoprefixer = require( 'gulp-autoprefixer' );
const cleanCss	= require( 'gulp-clean-css' );

function js() {
	const js = () =>  src( 'ts/scripts.js' )
		.pipe( babel() )
		.pipe( uglify() )
		.pipe( rename( {
			suffix: '.min'
		} ) )
		.pipe( dest( '.' ) );
	return gulp.watch( 'ts/scripts.js', js );
}


function css() {
	const css = () => src( 'style.scss' )
		.pipe( sass() )
		.pipe( autoprefixer() )
		.pipe( cleanCss( { compatibility: 'ie8' } ) )
		.pipe( rename( {
			suffix: '.min'
		} ) )
		.pipe( dest( '.' ) );
	return gulp.watch( 'style.scss', css );
}

exports.default = parallel( js, css );