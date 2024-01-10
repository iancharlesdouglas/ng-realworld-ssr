# `ng-realworld-ssr`

Angular RealWorld (Conduit) implementation with SSR including server-side data caching.

Achieves a Lighthouse score in the upper nineties and a TTI generally under 1 second.

## Demo
[Demo page](https://ng-realworld-ssr-project.web.app/)

## Hosting
This project is currently hosted on Firebase (Google Cloud) and is implemented to use that service.

The **Firebase CLI** is a prerequisite to running locally or deploying.

## Developing
### Starting Firebase
You need to start Firebase locally to run SSR on the local NodeJS server:
```
firebase serve --only functions,hosting
```

### Starting Angular
Start Angular in the usual way:
```
npm start
```
Or:
```
ng serve
```

## Deploying
### Manual Deployment
Deploy to Firebase:
```
firebase deploy
```

