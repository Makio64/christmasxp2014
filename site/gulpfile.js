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
var data = require ( "gulp-data" );

var browserify = require( "gulp-browserify" );
var source = require( "vinyl-source-stream" );
var html = require( "html-browserify" );
var coffeeify = require( "coffeeify" );

var minifyHtml = require( "gulp-minify-html" );
var minifyCss = require( "gulp-minify-css" );
var uglify = require( "gulp-uglify" );
var usemin = require( "gulp-usemin" );
var rev = require( "gulp-rev" );

var sprite = require( "gulp-spritesmith" );

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

var getDataJSON = function() {
  return require( "./src/data/data.json" );
}

var getDataXPs = function () {
  var dataXPs = getDataJSON();
  dataXPs.basePath = "./"
  return dataXPs;
}

gulp.task( "template-home", function() {

  gulp.src( src.templates + "index.jade")
      .pipe( plumber() )
      .pipe( data( getDataXPs() ) )
      .pipe( jade( { pretty: true, buffer: true, basedir: "src/templates/" } ) )
        .on( "error", gutil.log )
        .on( "error", gutil.beep )
      .pipe( gulp.dest( "app/" ) );

});

gulp.task( "template-experiments", function() {

  gulp.src( src.templates + "experiment.jade")
      .pipe( plumber() )
      .pipe( data( getDataXPs() ) )
      .pipe( jade( { pretty: true, buffer: true, basedir: "src/templates/" } ) )
        .on( "error", gutil.log )
        .on( "error", gutil.beep )
      .pipe( rename( "index.html" ) )
      .pipe( gulp.dest( "app/experiments/" ) );

});

gulp.task( "scripts", function() {

    gulp.src( src.scripts + "experiments/Main.coffee", { read: false } )
      .pipe( browserify( { 
          paths: [ "src/scripts/", "src/data/" ], 
          transform: [ html, "coffeeify" ], 
          extensions: [ ".coffee" ] 
        } ) )
        .on( "error", gutil.log )
        .on( "error", gutil.beep )
      .pipe( rename( "main-experiment.js" ) )
      .pipe( gulp.dest( "app/js" ) );

    gulp.src( src.scripts + "home/Main.coffee", { read: false } )
      .pipe( browserify( { 
          paths: [ "src/scripts/", "src/data/" ], 
          transform: [ html, "coffeeify" ], 
          extensions: [ ".coffee" ] 
        } ) )
        .on( "error", gutil.log )
        .on( "error", gutil.beep )
      .pipe( rename( "main-home.js" ) )
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

gulp.task( "sprites", function() {

  gulp.src( "src/imgs/*.png" )
      .pipe( sprite( {
          destImg: "app/css/imgs/sprite.png",
          destCSS: "app/css/sprite.css"
      } ) );

} );

gulp.task( "data", function() {

  gulp.src( "src/data/*.json" )
      .pipe( plumber() )
      .pipe( gulp.dest( "app/data/" ) );
 
} );


gulp.task( "watch", function() {

  gulp.watch( "src/styles/**/*.styl", [ "styles" ] );
  gulp.watch( "src/templates/**", [ "template-home", "template-experiments" ] );
  gulp.watch( "src/scripts/**/*.coffee", [ "scripts" ] );
  gulp.watch( "src/data/*.json", [ "data" ] );

});


gulp.task( "default", [ "bower-install", "browser-sync", "styles", "template-home", "template-experiments", "scripts", "watch", "data" ] );






// // Generate all pages

// var generateTaskPage = function( idx, isAvailable ) {
//   gulp.task( "taskPage" + idx, function( cb, err ) {

//     setTimeout( function() {
//       gulp.src( src.templates + "experiment.jade" )
//           .pipe( plumber() )
//           .pipe( data( getDataXPs( idx, isAvailable ) ) )
//           .pipe( jade( { pretty: true, buffer: true, basedir: "src/templates/" } ) )
//             .on( "error", gutil.log )
//             .on( "error", gutil.beep )
//           .pipe( rename(  ( idx + 1 ) + ".html" ) )
//           .pipe( gulp.dest( "app/" ) );

//       cb( err );
//     }, idx * 100 );

//   });
// }

// var tasksPage = [];

// var datasXPs = getDataXPs();
// var dataJSON = getDataJSON();
// var n = dataJSON.experiments.length;
// for( var i = 0; i < 25; i++ ) {
//   generateTaskPage( i, i < n );
//   tasksPage.push( "taskPage" + i );
// }

// gulp.task( "templates-all", tasksPage, function( cb, err ) {

//   setTimeout( function() {
//     cb( err );
//   }, 1000 );

// } );

