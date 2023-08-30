import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {AuthService} from "./auth.service";

//Manipulating incoming request and adding authorization header
//Takes request and allows it to continue in its path w/ next
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.authService.getToken();
    const authRequest = req.clone({
      headers: req.headers.set('Authorization', 'Bearer' + authToken)
    })
    return next.handle(authRequest);
  }
}
