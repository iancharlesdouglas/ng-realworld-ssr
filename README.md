# `ng-realworld-ssr`

Angular RealWorld (Conduit) implementation with SSR including server-side data caching.

Achieves a Lighthouse performance score in the upper nineties and a TTI generally under 1 second:

![ng-realworld-lighthouse-perf-score](https://github.com/iancharlesdouglas/ng-realworld-ssr/assets/3481593/fe576667-e9f2-4a0f-b70d-1445cac7110b)

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

Unit tests are written for and executed in Vitest (via AnalogJS). Code coverage rate is over 90%.

#### Running the Tests

```
npm test
```

#### Running with Coverage

To run tests with coverage (v8):

```
npm run test:c8
```

## Code Quality

Code quality is enforced using Prettier and ESLint (incl. plugins `angular-eslint`, `unicorn` and various recommended plugins) with a standard dose of 'opinion'.

Add the Prettier and ESLint plugins to VS Code and set _Format on save_ to `true` in the VS Code settings for IDE reformatting and error correction.

## Change Log

See [CHANGELOG.md](CHANGELOG.md)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)
