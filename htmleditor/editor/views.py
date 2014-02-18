from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout

from editor.models import File

# Create your views here.
def index(request):
	if request.user is not None:
		return redirect("/editor/files")
	else:
		return redirect("/login")

@login_required
def files(request):
	files = File.objects.all().filter(created_by=request.user)
	
	context = {'files': files, 'num_files': len(files), 'user': request.user, 'user_full_name': request.user.get_full_name()}
	
	return render(request, 'editor/files.html', context)
	
@login_required
def logout_view(request):
	logout(request)
	return redirect("/")

@login_required
def file_view(request, file_id):
    user = request.user
    return HttpResponse("File: " + str(file_id))