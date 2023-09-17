import {Component, OnDestroy, OnInit} from "@angular/core";
import {NgForm} from "@angular/forms";
import {AuthService} from "../auth.service";
import {Subscription} from "rxjs";


@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']

})

export class LoginComponent implements OnInit, OnDestroy{
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

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.login(form.value.email, form.value.password)
  }
}
