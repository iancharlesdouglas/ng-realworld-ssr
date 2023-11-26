#
# Dockerfile for testing locally with Apache 2 (static files)
#
FROM httpd:2.4

COPY ./dist/ng-realworld-ssr/browser/ /usr/local/apache2/htdocs/
COPY ./apache/httpd.conf /usr/local/apache2/conf/httpd.conf
