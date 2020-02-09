const {
	parallel, 
	src, 
	dest,
	watch
} 					= require( 'gulp' );

const babel 		= require( 'gulp-babel' );
const uglify 		= require( 'gulp-uglify' );
const concat 		= require( 'gulp-concat' );
const rename 		= require( 'gulp-rename' );

const sass			= require( 'gulp-sass' );
const autoprefixer 	= require( 'gulp-autoprefixer' );
const cleanCss		= require( 'gulp-clean-css' );

function js() {
	const js = () =>  src( [
		'node_modules/photoswipe/dist/photoswipe.min.js',
		'node_modules/swiper/js/swiper.min.js',
		'ts/scripts.js'
	] )
		.pipe( concat( 'scripts.js' ) )
		.pipe( babel() )
		.pipe( uglify() )
		.pipe( rename( {
			suffix: '.min'
		} ) )
		.pipe( dest( '.' ) );
	return watch( 'ts/scripts.js', js );
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
	return watch( [
		'scss/**',
		'style.scss'
	], css );
}

exports.default = parallel( js, css );