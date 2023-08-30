import {Component, OnDestroy, OnInit} from "@angular/core";
import {AuthService} from "../auth/auth.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.componet.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated: any = false;
  private authListenerSubs: Subscription;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });
  }

  onLogout() {
    this.authService.logout();
  }

  //need to unsubscribe if observable/subject gets destroyed
  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }


}
