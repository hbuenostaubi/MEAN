import {HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {catchError, throwError} from "rxjs";
import {Injectable} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";
import {ErrorComponent} from "./error/error.component";


//Manipulating incoming request and adding authorization header
//Takes request and allows it to continue in its path w/ next
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private dialog: MatDialog) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    //handle listens to the stream and we hook it to catch error with catcherror() operator (operators are great for manipulating streams)
    // takes an observable and returns another
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An Unknown error occurred'
        if(error.error.message){
          errorMessage=error.error.message;
        }
        this.dialog.open(ErrorComponent, {data: {message: errorMessage}});
        return throwError(() => error);
      })
    );
  }
}
