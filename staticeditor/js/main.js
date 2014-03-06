/*****************
 *	CPSC 437 Final Project
 *
*/


// Create Editor Namespace
(function(){
	var editor = {};

	function Editor(container, content, options){
		var self = this;

		// Steps

	}

	editor.initEditor = function(container, content, options){
		if( window.jQuery ){
			return new Editor(container, content, options);
		}
		else{
			console.error("Must load jQuery before loading the editor.");
			return;
		}
	}

})();

 

$(document).ready(function(){
	var dummyContent = "<h1>testing</h1>";

	// Load up the editor
	var editor = initEditor("#editor", dummyContent, {});
});