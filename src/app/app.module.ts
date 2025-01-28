import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, RouterModule, UrlSerializer } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';


import { AngularFireModule, FIREBASE_OPTIONS } from '@angular/fire/compat';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TokenInterceptor } from './services/auth-interceptor.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    RouterModule,
    AngularFireModule.initializeApp(environment.firebase),
    ServiceWorkerModule.register('manifest.json', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
    provideHttpClient(withInterceptorsFromDi())
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
