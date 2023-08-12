// import {Component, Input, OnInit} from "@angular/core";
import {Component, OnDestroy, OnInit} from "@angular/core";
import {Post} from '../post.model'
import {PostService} from "../post.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.less']
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [{title: 'First Post', content: "This is the first post's content"},
  //   {title: 'Second Post', content: "This is the second post's content"},
  //   {title: 'Third Post', content: "This is the third post's content"}
  // ];
  // @Input() posts: Post[] = [];
  posts: Post[] = [];
  isLoading: boolean = false;
  private postsSub: Subscription;

  //dependancy injection of posts from service
  //if adding public need to go to app module and add to the providers array
  constructor(public postService: PostService) {

  }

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts();
    this.postsSub = this.postService.getPostUpdateListener()
      .subscribe((posts: Post[]) => {   // ()=> function when new value is received or subscription callback
        this.isLoading = false;
        this.posts = posts;
      });
  }

  onDelete(postId: string) {
    this.postService.deletePost(postId);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();  ///removes subscription and prevents memory leaks
  }

}
