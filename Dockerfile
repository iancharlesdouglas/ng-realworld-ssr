#
# Dockerfile for testing with NodeJS Express server
#
FROM node

WORKDIR /ng-realworld-ssr

COPY ./dist/ng-realworld-ssr/server/ /ng-realworld-ssr/

EXPOSE 4000

CMD ["node", "server.mjs"]
