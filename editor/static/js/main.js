// AJAX setup for Django

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

$.ajaxSetup({
    crossDomain: false, // obviates need for sameOrigin test
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type)) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});



// editor namespace
var sruide = {};
(function(){

	// constants
	var FILE_LIST_ID = "#file_list";
	var NUM_FILES_ID = "#num_files";
	
	var GREETING_ID = "#greeting";
	var LOADING_ID = "#content_loading";
	
	var CONTENT_COLUMN_ID = "#content_column";
	var FILE_EDITOR_ID = "#file_editor";
	
	var FILE_COLUMN_ID = "#file_column";
	
	var FILE_COLUMN_ARROW_ID = "#file_column_arrow";
	
	var LEFT_ARROW_PATH = "/static/img/arrow.gif";
	var RIGHT_ARROW_PATH = "/static/img/arrow2.png";
	
	// namespace globals
	var editor;
	
	
	function displayErrorMessage(message){
		$("div#greeting").hide();
		
		$("div#error_message").text(message);
		$("div#error_message").show();
	}
	
	function setLoaded(){
		$(LOADING_ID).hide();
		$(GREETING_ID).show();
		$(CONTENT_COLUMN_ID).show();
	}
	
	
	// Class FileManager
	function FileManager(){
		var self = this;
		
		self.files = [];
		
		self.contentColumn = $(CONTENT_COLUMN_ID);
		self.contentColumn.hide();
		
		$(FILE_EDITOR_ID).width(self.contentColumn.width()-5);
		$(FILE_EDITOR_ID).height($(window).height()-120);
		
		$(FILE_COLUMN_ID).height(self.contentColumn.height());
		
		$(window).resize(function(){
			
			
			$(FILE_EDITOR_ID).width(self.contentColumn.width()-5);
			$(FILE_EDITOR_ID).height($(window).height()-120);
			editor.resize();
			
			$(FILE_COLUMN_ID).height(self.contentColumn.height());
		});
		
		self.registerUiEventHandlers();
		
	}
	
	FileManager.prototype.registerUiEventHandlers = function(){
		var leftPanelExpanded = true;
		
		$(FILE_COLUMN_ARROW_ID).click(function(){
			// RENEE WILL DO THIS!
			var self = this;
			var expanded = true;
			if(leftPanelExpanded)//if arrow is pointing left
				{
				// contract it
				 self.src = RIGHT_ARROW_PATH; //flip arrow
				 $(FILE_COLUMN_ID).animate({
					 width: "7.5%"
				 },{
					 duration: 500
				 });
				 $(CONTENT_COLUMN_ID).animate({
					 width: "91.5%"
				 },500);
				 
				 $(GREETING_ID).hide();
				 $(FILE_LIST_ID).hide();
				 leftPanelExpanded = false;
				}
			else //if pointing right, make left. 
				{
				 self.src = LEFT_ARROW_PATH;
				 $(FILE_COLUMN_ID).animate({
					 width: "18%"
				 },{
					 duration: 500,
					 done: function(){
						 $(GREETING_ID).show();
						 $(FILE_LIST_ID).show();
					 }
				 });
				 $(CONTENT_COLUMN_ID).animate({
					 width: "80%"
				 },500);
				 leftPanelExpanded = true;
				}
		});
	};
	
	
	FileManager.prototype.fetchUserFiles = function(){
		var self = this;
		
		$.post("/ajax/editor/file/user_file_list.json", function(data){
			if( data.success ){
				
				self.files = [];
				
				for(var index in data.data){
					var file = new File(data.data[index]);
					self.files.push(file);
				}
				
				self.displayFileList();
			}
			else{
				displayErrorMessage("Unable to load user file data.  Please reload the page.");
			}
		});
	};
	
	
	function displayFile(data){
		$("article#file_content header h1").text(data.file_path);
		//$("article#file_content div#file_editor").text(data.content);
		
		editor.setValue(data.content);
		//heightUpdateFunction();
		editor.resize();
		
		//editor.goToLine(1);
	}
	
	FileManager.prototype.displayFileList = function(){
		var self = this;
		
		if( self.files != null && self.files != undefined ){
			
			
			var list = $(FILE_LIST_ID);
			var num_files = self.files.length;
			$(NUM_FILES_ID).text(num_files);
			
			var fileListDOM = $("#file_list");
			for(var index in self.files ){
				var file = self.files[index];
				var link = $("<a>");
				link.text(file.filename)
					.attr("href", "#");
				
				link.click((function(){
					// Click closure
					var fileClosure = file;
					return function(){
						console.log("Clicked file(" + fileClosure.id + ")");
						displayFile(fileClosure);
					};
				})());
				
				var listItem = $("<li>");
				listItem.append(link);
				
				fileListDOM.append(listItem);
			}
			
			setLoaded();
		}
	};
	
	// Class File
	function File(data){
		var self = this;
		
		self.id = data.id;
		self.content = data.content;
		self.created_by = data.created_by;
		self.file_path = data.file_path;
		self.file_type = data.file_type;
		self.filename = data.filename;
		self.users = data.users;
		
	}
	
	
	
	sruide.init = function(){
		editor = ace.edit("file_editor");
		editor.getSession().setMode("ace/mode/html");
		
		var fileManager = new FileManager();
		fileManager.fetchUserFiles();
		
		return fileManager;
	};
	
})();


var fileManager = sruide.init();

// Begin editor app.
/*
var editor;
editor = ace.edit("file_editor");
editor.getSession().setMode("ace/mode/html");

var heightUpdateFunction = function() {

    // http://stackoverflow.com/questions/11584061/
    var newHeight =
              editor.getSession().getScreenLength()
              * editor.renderer.lineHeight
              + editor.renderer.scrollBar.getWidth();

    $('#file_editor').height(newHeight.toString() + "px");
    //$('#editor-section').height(newHeight.toString() + "px");

    // This call is required for the editor to fix all of
    // its inner structure for adapting to a change in size
    editor.resize();
};

//editor.getSession().on('change', heightUpdateFunction);

function fileClick(pk, element){
	$.post("/ajax/editor/file/" + pk + "/get.json", function(data){
		if( data.success ){
			displayFile(data.data);
		}
		else{
			displayErrorMessage("Unable to load file data.  Please reload the page.");
		}
	});
}

function displayFileList(data){
	
	var list = $("#file_list");
	
	if( data != null ){
		
		var num_files = data.length;
		$("#num_files").text(num_files);
		
		for(var index in data){
			var file = data[index];
			var li = $("<li>");
			
			var link = $("<a>");
			link.attr("id", "file_link_" + file.pk);
			link.attr("href", "#");
			link.text(file.filename);
			
			link.click( (function(){
                // Provide closure for callback variables
               var pk = file.pk;
                return function(){
                    fileClick(pk, this);  
                };
            })() );

			
			li.append(link);
			list.append(li);
			
		}
		
		$("div#greeting").show();
	}
}

$(document).ready(function(){
	$("div#greeting").hide();
	
	$.post("/ajax/editor/file/user_file_list.json", function(data){
		if( data.success ){
			displayFileList(data.data);
			displayFile(data.data[0]);
		}
		else{
			displayErrorMessage("Unable to load user file data.  Please reload the page.");
		}
	});
	
	
	
});*/