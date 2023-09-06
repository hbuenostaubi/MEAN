import {Component, OnInit} from '@angular/core'
// import {EventEmitter, Output} from '@angular/core'
import {Post} from '../post.model'
import {FormControl, FormGroup, NgForm, Validators} from "@angular/forms";
import {PostService} from "../post.service";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {mimeType} from "./mime-type.validator";


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.less']
})
export class PostCreateComponent implements OnInit {
  enteredTitle: String = ''
  enteredContent: String = '';
  public post: Post;
  isLoading: boolean = false;
  form: FormGroup;
  private mode = 'create';
  private postId: string;
  imagePreview: string | ArrayBuffer;


  // @Output() postCreated = new EventEmitter<Post>();  //Can define event emitter with data it passes else any
  ngOnInit(): void {
    this.form = new FormGroup<any>({
      title: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      content: new FormControl(null, {validators: [Validators.required]}),
      image: new FormControl(null, {validators:[Validators.required], asyncValidators:[mimeType]})  // takes mimeTypeValidator observer
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {
            id: postData._id, title: postData.title, content: postData.content, imagePath: postData.imagePath, creator: postData.creator
          };
          this.form.setValue({
            title: this.post.title, content: this.post.content, image: this.post.imagePath
          });
        });

      } else {
        this.mode = 'create';
        this.postId = null;
      }
    }); // when we get the data from the route url and can listen/update UI
  }

  constructor(public postService: PostService, public route: ActivatedRoute) {  //active
  }

  // Event is a default javascript type
  onImagePick(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file}); //setValue sets alls the controls vs patch that sets a single
    this.form.get('image').updateValueAndValidity();  // informs angular that there is a new value for validation
    //convert image to data URL
    const reader = new FileReader();
    reader.onload = () => { //callback ();function when it is done loading
      this.imagePreview = reader.result;  // got an error b/c it wanted a string can also use reader.result as string
    };
    reader.readAsDataURL(file) //input is a blob file when file is done loading
  }

  onSavePost() {
    console.log('save post')
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
    } else {
      this.postService.updatePost(this.postId, this.form.value.title, this.form.value.content, this.form.value.image);
    }
    this.form.reset();  //to reset the data after it has been processed
  }
}
