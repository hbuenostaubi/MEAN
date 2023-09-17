import {Post} from './post.model'
import {Subject} from 'rxjs'  //An event emmitter for bloader use
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {map} from 'rxjs/operators'
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";

const BACKEND_URL = environment.apiUrl+'/posts/';

@Injectable({providedIn: 'root'})   //provides it in the root level and will only create one instance of the service through the app
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>()

  constructor(private http: HttpClient, private router: Router) {
  }

  getPosts() {
    // return [...this.posts];  //creating a true copy of the post (spread operator) / creates new array w/ the old objects
    this.http
      .get<{ message: string; posts: any }>(BACKEND_URL)
      .pipe(
        map(postData => {
          return postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath,
              creator: post.creator
            };
          });
        })
      )
      .subscribe(transformedPosts => {

        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    //spread operator pulls all the properties of an object '...' and adds them to a new object
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: string;
    }>(BACKEND_URL + id);
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData(); //allows to combine text and blobs
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http  //expected results below from api
      .post<{ message: string, post: Post }>(BACKEND_URL, postData)
      .subscribe(responseData => {
        const post: Post = {
          id: responseData.post.id,
          title: title,
          content: content,
          imagePath: responseData.post.imagePath,
          creator: null
        }
        const id = responseData.post.id;
        post.id = id;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"])
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData;
    if (typeof (image) === 'object') { //if object create new postData
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {  //we have a string as an image
      postData = {id: id, title: title, content: content, imagePath: image};
    }

    this.http.put(BACKEND_URL + id, postData).subscribe(response => {
      const updatedPosts = [...this.posts];
      const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
      const post: Post = {
        id: id,
        title: title,
        content: content,
        imagePath: 'response.imagePath',
        creator: postData.creator
      };
      updatedPosts[oldPostIndex] = post;
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(["/"]);
    });
  }

  deletePost(postId: string) {
    this.http.delete(BACKEND_URL + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }
}
