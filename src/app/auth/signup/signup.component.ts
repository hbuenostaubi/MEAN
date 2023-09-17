import {Component, OnDestroy, OnInit} from "@angular/core";
import {NgForm} from "@angular/forms";
import {AuthService} from "../auth.service";
import {Subscription} from "rxjs";


@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.less']

})

export class SignupComponent implements OnInit, OnDestroy {
  isLoading: Boolean = false;
  private authStatutsSub: Subscription;

  constructor(public authService: AuthService) {
  }

  ngOnInit() {
    this.authStatutsSub = this.authService.getAuthStatusListener().subscribe(
      authStatus=> {
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy() {
    this.authStatutsSub.unsubscribe();
  }

  onSignup(form: NgForm) {
    console.log('signup user:')
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.password);
  }
}
