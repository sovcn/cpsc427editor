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
    file_path = models.CharField(max_length=255)
    
    created_on = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)
    
    created_by = models.ForeignKey(User)
    users = models.ManyToManyField(User, related_name="%(app_label)s_%(class)s_related", max_length=255, blank=True, null=True)
    content = models.TextField()
    
    def __str__(self):
        return self.filename