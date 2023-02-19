import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';
import { shareReplay, tap } from 'rxjs';
import { WebRequestService } from './web-request.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(
    private webservice: WebRequestService,
    private router: Router,
    private http: HttpClient,
    private _snackBar: MatSnackBar
  ) { }

  login(email: string, password:string)
  {
    return this.webservice.login(email,password).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>)=>{
        //the auth token will be in the header of this response
        this.setSession(res.body._id, res.headers.get('x-access-token'), res.headers.get('x-refresh-token'));
      })
    )
  }

  signup(email: string, password:string)
  {
    console.log(email);
    return this.webservice.signup(email,password).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>)=>{
        //the auth token will be in the header of this response
        this.setSession(res.body._id, res.headers.get('x-access-token'), res.headers.get('x-refresh-token'));
      })
    )
  }

  logout()
  {
    this.removeSession();

    this.router.navigate(['/login']);

    this.openSnackBar('Logged out Successfully');
  }

  getAccessToken()
  {
    return localStorage.getItem('x-access-token') || '';
  }

  setAccessToken(accessToken: any)
  {
    return localStorage.setItem('x-access-token', accessToken);
  }

  getRefreshToken():string
  {
    return localStorage.getItem('x-refresh-token') || '';
  }

  getUserId()
  {
    return localStorage.getItem('user-id') || '';
  }

  private setSession(userId:string, accessToken:string | any, refreshToken:string | any)
  {
    localStorage.setItem('user-id', userId);
    localStorage.setItem('x-access-token', accessToken);
    localStorage.setItem('x-refresh-token', refreshToken);
  }

  private removeSession()
  {
    localStorage.removeItem('user-id');
    localStorage.removeItem('x-access-token');
    localStorage.removeItem('x-refresh-token');
  }

  getNewAccessToken()
  {
    return this.http.get(`${this.webservice.RootURL}/users/me/access-token`,{
      headers: {
        'x-refresh-token': this.getRefreshToken(),
        '_id': this.getUserId()
      },
      observe: 'response'
    }).pipe(
      tap((res: HttpResponse<any>)=>{
        this.setAccessToken(res.headers.get('x-access-token'));
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
}
