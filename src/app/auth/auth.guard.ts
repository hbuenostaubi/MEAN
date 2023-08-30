import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {AuthService} from "./auth.service";

//We want to inject a service into a service so need decorator @Injetable
@Injectable()
export class AuthGuard implements CanActivate {  //no need to use implements CanActivate
  constructor(private authService: AuthService, private router: Router) {
  }

  //route trying to load, snapshot of the router state => returns boolean or an observable or promise (which yields a boolean)
  //if it returns true, the route is enabled else it is denied
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    const isAuth = this.authService.getIsAuth();
    if (!isAuth) {
      this.router.navigate(['/']);
    }
    return isAuth;
  }
}
