import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from 'src/app/task.service';
import { List } from 'src/app/models/list.model';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-new-list',
  templateUrl: './new-list.component.html',
  styleUrls: ['./new-list.component.scss']
})
export class NewListComponent {

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private taskservice: TaskService, private router: Router,private _snackBar: MatSnackBar) {

  }

  createList(title:string)
  {
    this.taskservice.createNewList(title).subscribe((list:List | any)=>{
      //Now we navigate to /lists/response._id
      this.router.navigate(['/lists', list._id]);

      this.openSnackBar('List created successfully');
  },(err)=>{
    this.openSnackBar(err.error.message);
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
