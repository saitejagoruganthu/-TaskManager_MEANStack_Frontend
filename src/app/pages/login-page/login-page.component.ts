import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent{
  hide = true;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private authservice: AuthService,private router: Router,private _snackBar: MatSnackBar) {}

  onLoginBtnClick(email:string, password:string)
  {
    this.authservice.login(email,password).subscribe((res: HttpResponse<any>)=>{
      if(res.status === 200)
      {
        //we have logged in successfully
        this.router.navigate(['/lists']);
        this.openSnackBar('Logged in Successfully!!');
      }
      /* else
      {
        this.openSnackBar('There was a problem while logging in!! Try again');
      } */
      
    })
  }

  openSnackBar(content:string) {
    this._snackBar.open(content, 'Close', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 3000
    });
  }
}
