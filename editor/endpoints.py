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
	
ajax.endpoint.register(File, FileEndpoint)