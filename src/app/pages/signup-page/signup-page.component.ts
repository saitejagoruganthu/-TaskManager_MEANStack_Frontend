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
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss']
})
export class SignupPageComponent {
  hide: boolean = true
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private authservice: AuthService, private route: Router,private _snackBar: MatSnackBar) {}

  onSignupBtnClick(email:string, password:string)
  {
    this.authservice.signup(email,password).subscribe((res: HttpResponse<any>)=>{
      this.route.navigate(['/lists']);

      this.openSnackBar('Signed up Successfully');
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
