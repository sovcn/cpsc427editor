from django.conf.urls import patterns, url

from editor import views

urlpatterns = patterns('',
	url(r'^$', views.index, name='index'),
	url(r'files', views.files, name='files'),
	url(r'create', views.create_file, name='create_file'),
    url(r'^file/(?P<file_id>\d+)/$', views.preview_file, name='preview_file'),
    url(r'^file/download/(?P<file_id>\d+)/.+\.(svg|html|js)$', views.download_file, name='download_file'),
)