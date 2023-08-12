import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {PostListComponent} from "./posts/post-list/post-list.component";
import {PostCreateComponent} from "./posts/post-create/post-create.component";

const routes: Routes = [
  {path: '', component: PostListComponent},
  {path:'create', component:PostCreateComponent},
  {path: 'edit/:postId', component: PostCreateComponent}  //extracts by id
];

@NgModule({
  imports:[RouterModule.forRoot(routes)],
  exports:[RouterModule]
})

// its better to set up all the routing in a seperate document
export class AppRoutingModule {

}
