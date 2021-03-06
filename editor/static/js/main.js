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
	var FILE_LIST_ID = "#file_list_container";
	var NUM_FILES_ID = "#num_files";
	
	var GREETING_ID = "#greeting";
	var LOADING_ID = "#content_loading";
	
	var CONTENT_COLUMN_ID = "#content_column";
	var FILE_EDITOR_ID = "#file_editor";
	
	var FILE_COLUMN_ID = "#file_column";
	
	var FILE_COLUMN_ARROW_ID = "#file_column_arrow";
	
	var LEFT_ARROW_PATH = "/static/img/arrow.gif";
	var RIGHT_ARROW_PATH = "/static/img/arrow2.png";
	
	var SAVE_BUTTON_ID = "#save_file";
	
	var DELETE_BUTTON_ID = "#delete_file";
	var DOWNLOAD_BUTTON_ID = "#download_file";
	var PREVIEW_BUTTON_ID = "#preview_file";
	var NEW_FILE_BUTTON_ID = "#newFileButton";
	
	// namespace globals
	var editor;
	
	var popupWins = new Array();
	
	
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
	
	function editorResize(self){
		$(FILE_EDITOR_ID).width(self.contentColumn.width()-5);
		$(FILE_EDITOR_ID).height($(window).height()-120);
		editor.resize();
		
		$(FILE_COLUMN_ID).height(self.contentColumn.height());
	}
	
	// Class FileManager
	function FileManager(){
		var self = this;
		
		self.files = [];
		
		self.currentFile = null;
		
		self.contentColumn = $(CONTENT_COLUMN_ID);
		self.contentColumn.hide();
		
		$(DELETE_BUTTON_ID).hide();
		$(SAVE_BUTTON_ID).hide();
		$(PREVIEW_BUTTON_ID).hide();
		$(DOWNLOAD_BUTTON_ID).hide();
		
		editorResize(self);
		
		$(window).resize(function(){
			editorResize(self);
		});
		
		self.registerUiEventHandlers();
		
	}
	
	FileManager.prototype.registerUiEventHandlers = function(){
		var self = this;
		
		var leftPanelExpanded = true;
		
		$(NEW_FILE_BUTTON_ID).click(function(){
			
			var name = $( "#name" );
			var allFields = $( [] ).add( name );
			var tips = $( ".validateTips" );
			
			function updateTips( t ) {
			      tips
			        .text( t )
			        .addClass( "ui-state-highlight" );
			      setTimeout(function() {
			        tips.removeClass( "ui-state-highlight", 1500 );
			      }, 500 );
			    }
			
			
			function checkLength( o, n, min, max ) {
			      if ( o.val().length > max || o.val().length < min ) {
			        o.addClass( "ui-state-error" );
			        updateTips( "Length of " + n + " must be between " +
			          min + " and " + max + "." );
			        return false;
			      } else {
			        return true;
			      }
			    }
			
			// https://jqueryui.com/dialog/#modal-form
			$("#create-file-dialog").dialog({
			      autoOpen: true,
			      height: 400,
			      width: 350,
			      modal: true,
			      buttons: {
			        "Create File": function() {
			          //alert(document.getElementById("name").value);
			          var bValid = true;
			          allFields.removeClass( "ui-state-error" );
			          var file_parsed = name.val().split('/');
	           	      file_parsed.shift(); //removes first blank element
	           	      //file_parsed = file_parsed; //set the array 
	           	      var file_array_size = file_parsed.length; //size of array
	           	      var puncFlag = parseInt(file_parsed[0].lastIndexOf('.')); //if 1, period found. if -1, not found. used to test for extension in file
	           	      var extension = file_parsed[0].substring(file_parsed[0].lastIndexOf('.'), file_parsed[0].length);
	           	      
	           	 if (puncFlag > 0)
	           		 {
	           		  
	           	      if (extension != ".html" && extension != ".svg" && extension != ".js")
			        	  {
			        	   bValid = false;
			        	   alert("Please enter a valid extension");
			        	  }
			          else if (checkLength ( name, "file name", 3, 200 ) == false)
			              {
			        	   bValid = false;
			        	   alert("Please enter between 3 and 200 characters");
			              }
			          else if (name.val().charAt(0) != '/')
			        	  {
			        	  bValid = false;
			        	  alert("Please use '/' format")
			        	  }
			          else
			        	  {
			        	   bValid  = true;
			        	  }
	           		 }
	           	 else //no extension present, meaning they want to create a folder first
	           		 { 
	           		   var folderFile = file_parsed[file_array_size-1];
	           		   var extension2 = folderFile.substring(folderFile.lastIndexOf('.'), folderFile.length);
	           		   if (extension2 != ".html" && extension2 != ".svg" && extension2 != ".js")
		        	   {
		        	     bValid = false;
		        	     alert("Please enter a valid extension, or add at least one file to your new folder");
		        	   }
		               else if (name.val().charAt(0) != '/') //must start with '/' 
		        	   {
		        	    bValid = false;
		        	    alert("Please use '/' format")
		        	   }
		               else
		        	   {
		        	    bValid  = true;
		        	   }
	           		 }
			          if (bValid) 
			          {  	   
			            // CREATE THE NEW FILE...
			        	  var file = {
			        			  		                     
			        			filename:file_parsed[file_array_size-1], //so even when we enter a path with a folder, it takes the file name.
			        			file_type:$( "input:radio[name=radio]:checked" ).val(),
			        			file_path:name.val(),
			        			content:""
			        	  };
			        	  
			        	  // At this point, file should be an {} (object) containing all necessary values
			        	  $.post("/ajax/editor/file/create_file.json",
			  					file,
			  					function(data){
			  						if( data.success ){
			  							location.reload();
			  							console.log("File saved...");
			  							// Refresh the file tree and load the file we just created...
			  						}
			  						else{
			  							console.error("Unable to save file.");
			  							// Let the user know an error has occured and do somethign about it.
			  						}
			  					});
			        	  
			        	  $.post
			        	  
			        	  console.log("Create new file.");
			            $( this ).dialog( "close" );
			          } //if bvalid  
			     
			        }, // create file function
			        Cancel: function() {
			          $( this ).dialog( "close" );
			        }
			      }, //buttons
			      close: function() {
			        allFields.val( "" ).removeClass( "ui-state-error" );
			      }
			    });
		});
	
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
				 
				 $(FILE_LIST_ID).hide();
				 $(NEW_FILE_BUTTON_ID).hide();
				 
				 leftPanelExpanded = false;
				}
			else //if pointing right, make left. 
				{
				 $(NEW_FILE_BUTTON_ID).show();
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
		
		$(SAVE_BUTTON_ID).click(function(){

			if(self.currentFile == null){
				console.log("Cannot save blank file");
				return;
			}

			var button = $(SAVE_BUTTON_ID);
			button.attr("disabled","disabled");
			var defBackground = button.css("background-color");
			button.css("background-color", "darkgray");
			button.text("Saving...");



			console.log("Saving: " + self.currentFile.id);

			self.currentFile.content = editor.getValue();

			$.post("/ajax/editor/file/" + self.currentFile.id + "/update.json",
					self.currentFile.toObject(),
					function(data){
						if( data.success ){
							console.log("File saved...");
							self.currentFile.updateData(data.data);
							self.displayFile(self.currentFile);
							button.removeAttr("disabled");
							button.css("background-color", defBackground);
							button.text("Save");
						}
						else{
							console.error("Unable to save file.");
							button.removeAttr("disabled");
							button.css("background-color", defBackground);
							button.text("Save");
						}
					});
		});
		
		//borrowed from http://www.codestore.net/store.nsf/unid/DOMM-4PYJ3S?OpenDocument
		function windowOpener(url, name, args) {
			/******************************* 
			the popupWins array stores an object reference for
			each separate window that is called, based upon
			the name attribute that is supplied as an argument
			*******************************/
			if ( typeof( popupWins[name] ) != "object" ){
			popupWins[name] = window.open(url,name,args);
			} else {
			if (!popupWins[name].closed){
			popupWins[name].location.href = url;
			} else {
			popupWins[name] = window.open(url, name,args);
			}
			}
			popupWins[name].focus();
			popupWins[name].reload();
			
		}
		
		$(PREVIEW_BUTTON_ID).click(function(){
			
			var file = self.currentFile;
			
		
			if(file == null){
				console.log("Cannot preview blank file");
				return;
			}
			
			var button = $(PREVIEW_BUTTON_ID);
			
			var url = "/editor/file/" + file.id;
			var winArgs = "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes";
			var winName = file.id;
			
			windowOpener(url,winName,winArgs);	
			
		});
		
		
		$(DOWNLOAD_BUTTON_ID).click(function(){
			
			var file = self.currentFile;
			
		
			if(file == null){
				console.log("Cannot download blank file");
				return;
			}
			
			
			var url = "/editor/file/download/" + file.id + "/" + file.filename;
			var winArgs = "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes";
			var winName = file.id;
			
			windowOpener(url,winName,winArgs);	
			
		});
		
		
		$(DELETE_BUTTON_ID).click(function(){
			
			var file = self.currentFile;
			
		
			if(file == null){
				console.log("Cannot preview blank file");
				return;
			}
			
			// Implement delete functionality.
			$("#delete-file-dialog").dialog({
		      buttons : {
		        "Confirm" : function() {
		          // Delete the file...
		        	
		        	var dialog = this;
		        	$.post("/ajax/editor/file/" + self.currentFile.id + "/delete.json",
						self.currentFile.toObject(),
						function(data){
							if( data.success ){
								console.log("File deleted...");
								self.currentFile = null;
								editor.setValue("");
								$(dialog).dialog("close");
								location.reload();
							}
							else{
								console.error("Unable to save file.");
								$(dialog).dialog("close");
							}
						});
		        },
		        "Cancel" : function() {
		          $(this).dialog("close");
		        }
		      }
		    });
			
		});	
	};
	
	
	FileManager.prototype.fetchUserFiles = function(){
		var self = this;
		
		// Recursively creates a file hierarchy based on each files path name
		// Path is an array of path elements separated by '/'
		function parsePath(path, hierarchy, file){
			if( path.length == 1 ){
				// File
				hierarchy.files.push(file);
			}
			else{
				// Folder
				var folder;
				if(path[0] in hierarchy.folders){
					// Folder exists...
					folder = hierarchy.folders[path[0]];
				}
				else{
					// Create the folder.
					folder = {
						folders: {},
						files: []
					};
				}
				
				var parsedFolder = parsePath(path.slice(1, path.length), folder, file);
				
				hierarchy.folders[path[0]] = parsedFolder;
			}
			return hierarchy;
		}
		
		$.post("/ajax/editor/file/user_file_list.json", function(data){
			if( data.success ){
				
				self.files = [];
				
				self.hierarchy = {
					folders: {},
					files: []
				};
				
				
				for(var index in data.data){
					var file = new File(data.data[index]);
					
					var pathArr = file.file_path.split('/');
					pathArr = pathArr.slice(1,pathArr.length);
					self.hierarchy = parsePath(pathArr, self.hierarchy, file);
					
					self.files.push(file);
				}
				
				self.displayFileList();
			}
			else{
				displayErrorMessage("Unable to load user file data.  Please reload the page.");
			}
		});
	};
	
	
	FileManager.prototype.displayFile = function(data){
		var self = this;
		
		$("article#file_content header h1").text(data.file_path);
		//$("article#file_content div#file_editor").text(data.content);
		
		editor.setValue(data.content);
		//heightUpdateFunction();
		switch(data.file_type){
		case "HTML":
			editor.getSession().setMode("ace/mode/html");
			break;
		case "JS":
			editor.getSession().setMode("ace/mode/javascript");
			break;
		case "SVG":
			editor.getSession().setMode("ace/mode/svg");
			break;
		}
		editorResize(self);
		
		$(DELETE_BUTTON_ID).show();
		$(SAVE_BUTTON_ID).show();
		$(PREVIEW_BUTTON_ID).show();
		$(DOWNLOAD_BUTTON_ID).show();
		
		//editor.goToLine(1);
	};
	
	FileManager.prototype.displayFileList = function(){
		var self = this;
		
		if( self.files != null && self.files != undefined ){
			
			
			var list = $(FILE_LIST_ID);
			var num_files = self.files.length;
			$(NUM_FILES_ID).text(num_files);
			
			var fileListContainer = $("#file_list_container");
			var fileListDOM = $("#file_list");
			
			var callbacks = [];
			
			// Used to recursively build the file hiearchy tree
			function constructDOM(hierarchy, domContainer){
				
				for(var index in hierarchy.folders ){
					var folder = hierarchy.folders[index];
					
					var folderItem = $("<li>");
					folderItem.text(index);
					
					var folderContainer = $("<ul>");
					folderItem.append(folderContainer);
					
					domContainer.append(folderItem);
					
					constructDOM(folder, folderContainer);
				}
				
				
				for(var index in hierarchy.files ){
					var file = hierarchy.files[index];
					var link = $("<a>");
					link.text(file.filename)
						.attr("href", "#");
					
					callbacks[file.id] = (function(){
						// Click closure
						var fileClosure = file;
						return function(){
							console.log("Clicked file(" + fileClosure.id + ")");
							self.currentFile = fileClosure;
							self.displayFile(fileClosure);
						};
					})();
					
					var listItem = $("<li>");
					
					switch(file.file_type){
					case "HTML":
						listItem.attr('data-jstree', '{"icon":"http://openiconlibrary.sourceforge.net/gallery2/open_icon_library-full/icons/png/16x16/mimetypes/oxygen-style/application-rtf.png"}');
						break;
					case "JS":
						listItem.attr('data-jstree', '{"icon":"http://openiconlibrary.sourceforge.net/gallery2/open_icon_library-full/icons/png/16x16/mimetypes/gnome-style/application-javascript.png"}');
						break;
					case "SVG":
						listItem.attr('data-jstree', '{"icon":"http://openiconlibrary.sourceforge.net/gallery2/open_icon_library-full/icons/png/16x16/mimetypes/gnome-style/image-svg+xml.png"}');
						break;
					}
					
					
					listItem.attr('id', 'file_' + file.id);
					
					listItem.append(link);
					
					domContainer.append(listItem);
				}
				
			}
			
			constructDOM(self.hierarchy, fileListDOM);
			
			fileListContainer.jstree()
			.on('select_node.jstree', function(e, data){
				var file_id = data.selected[0].replace("file_", "");
				callbacks[file_id]();
			});
			
			setLoaded();
		}
	};
	
	// Class File
	function File(data){
		var self = this;
		
		self.id = data.id;
		self.updateData(data);
		
	}
	
	File.prototype.updateData = function(data){
		 var self = this;
		 self.content = data.content;
	  	self.created_by = data.created_by;
	  	self.file_path = data.file_path;
	  	self.file_type = data.file_type;
	  	self.filename = data.filename;
	  	self.users = data.users;
	};
	
	File.prototype.toObject = function(){
		var self = this;

		return {
			id: self.id,
			pk: self.id,
			content: self.content,
			created_by: self.created_by,
			file_path: self.file,
			filename: self.filename,
			users: self.users
		}
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
