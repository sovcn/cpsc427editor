from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from django.utils.html import escape
from django.views.decorators.csrf import ensure_csrf_cookie

from editor.models import File
from editor.forms import FileForm

# Create your views here.
def index(request):
    if request.user is not None:
        return redirect("/editor/files")
    else:
        return redirect("/login")

@login_required
@ensure_csrf_cookie
def files(request):
    
    context = {'user': request.user, 'user_full_name': request.user.get_full_name()}
    
    return render(request, 'editor/files.html', context)
    
@login_required
def logout_view(request):
    logout(request)
    return redirect("/")

@login_required
def view_file(request, file_id):
    user = request.user
    file = get_object_or_404(File,pk=int(file_id))
    
    has_permission = False
    
    file_users = file.users.all()
    if user.id != file.created_by.id:
        for shared_user in file_users:
            if user.id == shared_user.id:
                has_permission = True
                break
    else:
        has_permission = True

    if not has_permission:
        return HttpResponse("You do not have permission to view this file.")
    
    context = {'file': file, 'file_content': escape(file.content)}

    return render(request, 'editor/view_file.html', context)
	
@login_required
def preview_file(request, file_id):
    user = request.user
    file = get_object_or_404(File,pk=int(file_id))
    
    has_permission = False
    
    file_users = file.users.all()
    if user.id != file.created_by.id:
        for shared_user in file_users:
            if user.id == shared_user.id:
                has_permission = True
                break
    else:
        has_permission = True

    if not has_permission:
        return HttpResponse("You do not have permission to view this file.")
    
    if file.file_type == 'HTML':
        return HttpResponse(content_type="text/html", content=file.content)
    elif file.file_type == 'JS':
        return HttpResponse(content_type="application/javascript", content=file.content)
    elif file.file_type == 'SVG':
        return HttpResponse(content_type="text/html", content=file.content)
    else:
        return HttpResponse("Invalid File Type.")


@login_required
def download_file(request, file_id):
    user = request.user
    file = get_object_or_404(File,pk=int(file_id))
    
    has_permission = False
    
    file_users = file.users.all()
    if user.id != file.created_by.id:
        for shared_user in file_users:
            if user.id == shared_user.id:
                has_permission = True
                break
    else:
        has_permission = True

    if not has_permission:
        return HttpResponse("You do not have permission to view this file.")
    
    return HttpResponse(mimetype='application/force-download', content=file.content)
    
    

@login_required
def create_file(request):
	if request.method == 'POST': # If the form has been submitted...
        
		form = FileForm(request.POST) # A form bound to the POST data
		if form.is_valid(): # All validation rules pass
			# Process the data in form.cleaned_data
			# ...
			file = form.save(commit=False)
			
			file.created_by = request.user
			
			file.save()
			
			return redirect("/editor/files")
	else:
		form = FileForm() # An unbound form
	
	return render(request, 'editor/create_file.html', {
		'form': form,
	})
	
