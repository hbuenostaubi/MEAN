import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {PostCreateComponent} from "./posts/post-create/post-create.component";
import {AppComponent} from './app.component';
import {FormsModule} from '@angular/forms'; //template forms module
import {ReactiveFormsModule} from "@angular/forms"; //reactive forms module
import {MatInputModule} from "@angular/material/input";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatToolbarModule} from "@angular/material/toolbar";
import {HeaderComponent} from "./header/header.component";
import {PostListComponent} from "./posts/post-list/post-list.component";
import {MatExpansionModule} from "@angular/material/expansion";
import {PostService} from "./posts/post.service";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AppRoutingModule} from "./app-routing";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {LoginComponent} from "./auth/login/login.component";
import {SignupComponent} from "./auth/signup/signup.component";
import {AuthInterceptor} from "./auth/auth-interceptor";


@NgModule({
  declarations: [
    AppComponent,
    PostCreateComponent,
    PostListComponent,
    HeaderComponent,
    LoginComponent, SignupComponent
  ],
  imports: [
    BrowserModule, AppRoutingModule,
    BrowserAnimationsModule, ReactiveFormsModule,
    FormsModule,  // uses form templates (switched to reactive) ei, [ngModel]="post.title"
    MatInputModule, MatCardModule,
    MatButtonModule, MatToolbarModule,
    MatExpansionModule, HttpClientModule,
    MatProgressSpinnerModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
