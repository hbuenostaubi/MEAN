import {Component} from "@angular/core";
import {NgForm} from "@angular/forms";
import {AuthService} from "../auth.service";


@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.less']

})

export class SignupComponent {
  isLoading: Boolean = false;

  constructor(public authService: AuthService) {
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
