# `ng-realworld-ssr`

Angular RealWorld (Conduit) implementation with SSR including server-side data caching.

Achieves a Lighthouse score in the upper nineties and a TTI generally under 1 second.

## Demo
[Demo page](https://ng-realworld-ssr-project.web.app/)

## Features
- Express server-side caching to speed up home page load when preparing dynamic SSR
- State implemented using custom store that extends RxJS `BehaviorSubject`
- Angular Service Worker to speed up visited page load performance.

## Developing

### Starting Firebase
You need to start Firebase locally to run SSR on NodeJS locally:
```
firebase serve --only functions,hosting
```

See Hosting below.

### Starting Angular
Start Angular in the usual way:
```
npm start
```
Or:
```
ng serve
```

## Hosting

This project is currently hosted on Firebase (Google Cloud) and is implemented to use that service.

The **Firebase CLI** is a prerequisite to running locally or deploying.

## Deploying

### Manual Deployment
Deploy to Firebase:
```
firebase deploy
```

## Testing

### Unit Tests -- `vitest`

Unit tests are written for and executed in Vitest (via AnalogJS).

#### Running 
```
npm test
```

#### Running with Coverage
```
npm run test:c8
```

