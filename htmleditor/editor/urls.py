from django.conf.urls import patterns, url

from editor import views

urlpatterns = patterns('',
	url(r'^$', views.index, name='index'),
	url(r'files', views.files, name='files'),
)