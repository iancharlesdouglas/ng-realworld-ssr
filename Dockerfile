#
# Dockerfile for testing with NodeJS Express server
#
FROM node

COPY ./dist/ng-realworld-ssr/server/ .

CMD ["node", "server.mjs"]
