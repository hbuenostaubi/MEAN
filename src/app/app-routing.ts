import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {PostListComponent} from "./posts/post-list/post-list.component";
import {PostCreateComponent} from "./posts/post-create/post-create.component";
import {LoginComponent} from "./auth/login/login.component";
import {SignupComponent} from "./auth/signup/signup.component";
import {AuthGuard} from "./auth/auth.guard";

const routes: Routes = [
  {path: '', component: PostListComponent},
  {path:'create', component:PostCreateComponent, canActivate: [AuthGuard]}, //if not logged in, you get forwarded to login page as not authorized
  {path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGuard]},  //extracts by id
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent}
];

@NgModule({
  imports:[RouterModule.forRoot(routes)],
  exports:[RouterModule],
  providers:[AuthGuard]  //used to Guard routes that we don't want anyone to activate and declared again in the routes
})

// its better to set up all the routing in a seperate document
export class AppRoutingModule {

}
