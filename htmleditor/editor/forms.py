from django.forms import ModelForm
from editor.models import File

class FileForm(ModelForm):
	class Meta:
		model = File
		fields = {'filename', 'file_type', 'file_path', 'users', 'content' }