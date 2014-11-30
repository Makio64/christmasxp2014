done = function( delay, callback ) {
  if( callback ) {
    setTimeout( function() {
      callback.call( null );
    }, delay );
  }
  return {
    then: function( callback ) {
      setTimeout( function() {
        callback.call( null );
      }, delay);
    }
  };
};

if( typeof module !== 'undefined' && module.exports ) {
	module.exports = done;
} else {
	window.done = done;
}