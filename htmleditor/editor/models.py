from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class File(models.Model):
	HTML = 'HTML'
	JAVASCRIPT = 'JS'
	SVG = 'SVG'
	
	FILE_CHOICES = (
		(HTML, 'HTML'),
		(JAVASCRIPT, 'JavaScript'),
		(SVG, 'SVG'),
	)

	filename = models.CharField(max_length=50)
	file_type = models.CharField(max_length=4, choices=FILE_CHOICES, default=HTML)
	created_on = models.DateTimeField(auto_now_add=True)
	created_by = models.ForeignKey(User)
	content = models.TextField(max_length=5000)