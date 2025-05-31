import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// search module
import { Ng2SearchPipeModule } from '@ngx-maintenance/ng2-search-filter';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LayoutsModule} from "./layouts/layouts.module";
import { PagesModule } from "./pages/pages.module";

// Auth
import { HttpClient, HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { initFirebaseBackend } from './authUtils';
import { FakeBackendInterceptor } from './core/helpers/fake-backend';
import { ErrorInterceptor } from './core/helpers/error.interceptor';
import { JwtInterceptor } from './core/helpers/jwt.interceptor';

// Language
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { NgxSpinnerModule } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { DxRadioGroupModule, DxSelectBoxModule, DxNumberBoxModule,DxTemplateModule } from 'devextreme-angular';
import config from 'devextreme/core/config';
import { ConfiguracionService } from './core/services/configuracion.service';

export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}
export function initApp(configService: ConfiguracionService) {
  return () => configService.getConfig(); // <- Angular espera esta promesa
}

if (environment.defaultauth === 'firebase') {
  initFirebaseBackend(environment.firebaseConfig);
} else {
  FakeBackendInterceptor;
}

@NgModule({ declarations: [
        AppComponent
    ],
    bootstrap: [AppComponent], imports: [TranslateModule.forRoot({
            defaultLanguage: 'en',
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        }),
        BrowserAnimationsModule,
        NgxSpinnerModule,
        BrowserModule,
        AppRoutingModule, CommonModule,
        LayoutsModule,
        PagesModule,
        Ng2SearchPipeModule,
        DxRadioGroupModule,DxTemplateModule,
        DxSelectBoxModule,
        DxNumberBoxModule], providers: [
          
        {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [ConfiguracionService],
      multi: true, // importante: permite múltiples inicializadores
        },
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: FakeBackendInterceptor, multi: true },
        provideHttpClient(withInterceptorsFromDi()),
    ] })
 
export class AppModule { }
