import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {AppComponent} from './app.component';
import {HeaderComponent} from "./header/header.component";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AppRoutingModule} from "./app-routing";
import {AuthInterceptor} from "./auth/auth-interceptor";
import {ErrorInterceptor} from "./error-interceptor";
import {ErrorComponent} from "./error/error.component";
import {AngularMaterialModule} from "./angular-material.module";
import {PostsModule} from "./posts/post.module";
import {IndexComponent} from "./index/index.component";


@NgModule({
  declarations: [
    AppComponent, IndexComponent,
    HeaderComponent, ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularMaterialModule,
    PostsModule,
  ],
  //used for dependency injections
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},  //outgoing http request are watched by these
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}],  //on error this kicks in
  bootstrap: [AppComponent],
  // entryComponents: [ErrorComponent] //deprecated can now be declared by bootstrapping or declaration https://medium.com/ngconf/bye-bye-entrycomponents-a4cd933e8eaf
})
export class AppModule {
}
