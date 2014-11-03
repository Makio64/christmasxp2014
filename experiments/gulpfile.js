var gulp = require( "gulp" );

var plumber = require( "gulp-plumber" );
var gutil = require( "gulp-util" );

var bower = require( "gulp-bower" );
var wiredep = require( "wiredep" ).stream;

var jade = require( "gulp-jade" );
var stylus = require( "gulp-stylus" );
var nib = require( "nib" );
var coffee = require( "gulp-coffee" );
var rename = require( "gulp-rename" );
var concat = require( "gulp-concat" );

// var browserify = require( "browserify" );
var browserify = require( "gulp-browserify" );
var source = require( "vinyl-source-stream" );
var html = require( "html-browserify" );
var coffeeify = require( "coffeeify" );

var minifyHtml = require( "gulp-minify-html" );
var minifyCss = require( "gulp-minify-css" );
var uglify = require( "gulp-uglify" );
var usemin = require( "gulp-usemin" );
var rev = require( "gulp-rev" );

var browserSync = require( "browser-sync" );
  
var src = {
  styles: "src/styles/",
  scripts: "./src/scripts/",
  templates: "src/templates/",
}

gulp.task( "browser-sync", function() {

  browserSync.init( [ "app/js/*.js", "app/css/*.css", "app/*.html" ], {
    server: {
      baseDir: "./app"
    }
  } );

});


gulp.task( "bower-install", function() {

  bower( "app/js/bower_components" );

});

gulp.task( "bower-inject", function() {

  gulp.src( "app/index.html" )
      .pipe( plumber() )
      .pipe( wiredep( {
          directory: "bower_components",
          bowerJson: require( "./bower.json" )
        }))
        .on( "error", gutil.log )
        .on( "error", gutil.beep )
      .pipe( gulp.dest( app ) );

});


gulp.task( "styles", function() {

  gulp.src( src.styles + "*.styl" )
      .pipe( plumber() )
      .pipe( stylus( { 
          use: [ nib() ], 
          url: { name: "url", paths: [ "src/imgs" ], limit: false } 
        } ) )
        .on( "error", gutil.log )
        .on( "error", gutil.beep )
      .pipe( gulp.dest( "app/css/" ) );

});


gulp.task( "templates", function() {

  gulp.src( src.templates + "*.jade")
      .pipe( plumber() )
      .pipe( jade( { pretty: true, buffer: true, basedir: "src/templates/" } ) )
        .on( "error", gutil.log )
        .on( "error", gutil.beep )
      .pipe( gulp.dest( "app/" ) );

});


gulp.task( "scripts", function() {
    gulp.src( src.scripts + "Main.coffee", { read: false } )
      .pipe( browserify( { 
          paths: [ "src/scripts/" ], 
          transform: [ html, "coffeeify" ], 
          extensions: [ ".coffee" ] 
        } ) )
        .on( "error", gutil.log )
        .on( "error", gutil.beep )
      .pipe( rename( "app.js" ) )
      .pipe( gulp.dest( "app/js" ) );

} );


gulp.task( "minify", function() {

  gulp.src( "app/*.html" )
      .pipe( plumber() )
      .pipe( usemin( {
          css: [ minifyCss() ],
          html: [ minifyHtml( { empty: true } ) ],
          js: [ uglify(), rev() ]
        }))
      .pipe( gulp.dest( "dist/" ) );

});


gulp.task( "watch", function() {

  gulp.watch( "src/styles/**/*.styl", [ "styles" ] );
  gulp.watch( "src/templates/**/*.jade", [ "templates", "scripts" ] );
  gulp.watch( "src/scripts/**/*.coffee", [ "scripts" ] );

});


gulp.task( "default", [ "bower-install", "browser-sync", "styles", "templates", "scripts", "watch" ] );
// gulp.task( "default", [ "scripts" ] );
