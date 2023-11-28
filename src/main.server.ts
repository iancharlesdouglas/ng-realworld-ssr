import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

const bootstrap = () => {
  console.log('bootstrapping application');
  return bootstrapApplication(AppComponent, config);
};

export default bootstrap;
