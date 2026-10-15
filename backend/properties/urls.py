from django.urls import path

from . import views

urlpatterns = [
    path("csrf/", views.csrf_token, name="csrf-token"),
    path("site-settings/", views.site_settings, name="site-settings"),
    path("properties/", views.properties, name="properties"),
    path("inquiries/", views.inquiries, name="inquiries"),
]
