// import {Component, Input, OnInit} from "@angular/core";
import {Component, OnDestroy, OnInit} from "@angular/core";
import {Post} from '../post.model'
import {PostService} from "../post.service";
import {Subscription} from "rxjs";
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.less']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  isLoading: any = false;
  userIsAuthenticated: any = false;
  userId: string;
  private postsSub: Subscription;
  private authStatusSub: Subscription;

  //dependancy injection of posts from service
  //if adding public need to go to app module and add to the providers array
  constructor(public postService: PostService, private authService: AuthService) {

  }

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts();
    this.userId = this.authService.getUserId();
    this.postsSub = this.postService.getPostUpdateListener()
      .subscribe((posts: Post[]) => {   // ()=> function when new value is received or subscription callback
        this.isLoading = false;
        this.posts = posts;
      });

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onDelete(postId: string) {
    this.postService.deletePost(postId);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();  ///removes subscription and prevents memory leaks
    this.authStatusSub.unsubscribe();
  }

}
