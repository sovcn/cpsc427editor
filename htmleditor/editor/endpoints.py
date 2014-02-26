import ajax
from editor.models import File

class FileEndpoint(ajax.endpoints.ModelEndpoint):
	pass
	
ajax.endpoint.register(File, FileEndpoint)