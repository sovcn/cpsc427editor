import ajax
from editor.models import File
import json
from django.core import serializers
from django.forms import model_to_dict

class FileEndpoint(ajax.endpoints.ModelEndpoint):
	
	def user_file_list(self, request):
		file_list = []
		files = File.objects.all().filter(created_by=request.user)
		for fileObj in files:
			fileDict = model_to_dict(fileObj)
			fileDict['pk'] = fileDict['id']
			file_list.append(fileDict)
			
		return file_list
	
	def create_file(self, request):
		
		POST = request.POST
		filename = POST["filename"]
		file_path = POST["file_path"]
		file_type = POST["file_type"]
		content = POST["content"]
		
		user = request.user
		
		file = File()
		file.filename = filename
		file.file_path = file_path
		file.file_type = file_type
		file.content = content
		
		file.created_by = user
		
		file.save()
		
		fileObj = model_to_dict(file)
		fileObj['pk'] = fileObj['id']
		
		return fileObj
	
ajax.endpoint.register(File, FileEndpoint)