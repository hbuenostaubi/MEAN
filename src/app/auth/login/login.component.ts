import {Component} from "@angular/core";
import {NgForm} from "@angular/forms";
import {AuthService} from "../auth.service";


@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']

})

export class LoginComponent {
  isLoading:Boolean = false;

  constructor(public authService: AuthService) {

  }
  onLogin(form: NgForm){
    if(form.invalid){
      return;
    }
    this.isLoading = true;
    this.authService.login(form.value.email, form.value.password)
  }
}
