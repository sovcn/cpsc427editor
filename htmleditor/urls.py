from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'htmleditor.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

	url(r'^$', 'editor.views.index', name='index'),
	url(r'^login/$', 'django.contrib.auth.views.login'),
    url(r'^logout/$', 'editor.views.logout_view'),
	url(r'^editor/', include('editor.urls')),
	url(r'^ajax/', include('ajax.urls')),
    url(r'^admin/', include(admin.site.urls)),
	
	
)