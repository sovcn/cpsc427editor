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

function displayFile(data){
	$("article#file_content header h1").text(data.file_path);
	//$("article#file_content div#file_editor").text(data.content);
	
	editor.setValue(data.content);
	//heightUpdateFunction();
	editor.resize();
	
	editor.goToLine(1);
}

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

function displayErrorMessage(message){
	$("div#greeting").hide();
	
	$("div#error_message").text(message);
	$("div#error_message").show();
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