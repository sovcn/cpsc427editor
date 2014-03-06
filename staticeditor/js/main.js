/*****************
 *	CPSC 437 Final Project
 *
*/


// Create Editor Namespace
var editor = {};
(function(){

	editor.idPrefix = "editor_";

	function Editor(container, content, options){
		var self = this;

		self.container = $("#" + container);
		self.content = content;

		if( options == null || typeof options != "object"){
			options = {};
		}
		self.options = options;


		self.container.text(self.dummyContent);
		self.editor = ace.edit(container);
		self.editor.setTheme("ace/theme/monokai");
		self.editor.getSession().setMode("ace/mode/html");
	}

	editor.initEditor = function(container, content, options){
		if( window.jQuery ){
			return new Editor(container, content, options);
		}
		else{
			console.error("Must load jQuery before loading the editor.");
			return;
		}
	};

})();

 

$(document).ready(function(){
	var dummyContent = "<h1>testing</h1>";

	// Load up the editor
	var editorObj = editor.initEditor("editor", dummyContent, {});
});