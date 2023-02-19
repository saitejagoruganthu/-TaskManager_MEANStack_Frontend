import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError,tap, switchMap, empty, EMPTY, Subject } from 'rxjs';
import { AuthService } from './auth.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class WebReqInterceptor implements HttpInterceptor {

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private authservice: AuthService,private _snackBar: MatSnackBar) { }

  refreshingAccessToken: boolean = false;

  accessTokenRefreshed: Subject<any> = new Subject();

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //Handle the request
    req = this.addAuthHeader(req);

    //call next() and handle the response
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse)=>{
        console.log(error);

      if(error.status === 401)
        {
          //401 error - we are un-authorized

          //refresh the access token
          return this.refreshAccessToken()
          .pipe(
            switchMap(()=>{
              req = this.addAuthHeader(req);
              return next.handle(req);
            }),
            catchError((err:any)=>{
              console.log(err);
              this.authservice.logout();
              return EMPTY;
            })
          )
        }
        else
        {
          this.openSnackBar('There was a problem during logging in/signing up!! Try again');
        }

        return throwError(error);
        
      })
    )
  }

  openSnackBar(content:string) {
    this._snackBar.open(content, 'Close', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 3000
    });
  }

  refreshAccessToken()
  {
    if(this.refreshingAccessToken)
    {
      return new Observable(observer => {
        this.accessTokenRefreshed.subscribe(()=>{
          //this code will run when the access token has been refreshed
          observer.next();
          observer.complete();
        })
      })
    }
    else
    {
      this.refreshingAccessToken = true;
      //we want to call a method in auth service to send a request to refresh access token
      return this.authservice.getNewAccessToken().pipe(
        tap(()=>{
          this.refreshingAccessToken = false;
          console.log("Access Token Refreshed!");
          this.accessTokenRefreshed.next('');
        })
      )
    }
  }

  addAuthHeader(request: HttpRequest<any>)
  {
    //get the access token
    const token = this.authservice.getAccessToken();

    if(token)
    {
      //append the access token to the request header
      return request.clone({
        setHeaders: {
          'x-access-token': token
        }
      })
    }
    return request;
  }
}
