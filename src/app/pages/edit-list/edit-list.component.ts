import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from 'src/app/task.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-list',
  templateUrl: './edit-list.component.html',
  styleUrls: ['./edit-list.component.scss']
})
export class EditListComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(
    private taskservice: TaskService, 
    private route: ActivatedRoute, 
    private router: Router,
    private _snackBar: MatSnackBar
  ) {

  }

  listId: string | any;
  currentListTitle: string | any;
  
  ngOnInit(): void {

    this.route.params.subscribe((params:any)=>{
      this.listId = params.listId
    })

    this.taskservice.getSingleList(this.listId).subscribe((res)=>{
      
      this.currentListTitle = Object.values(res)[0].title;
    })

  }

  updateList(title: string)
  {
    this.taskservice.updateList(this.listId,title).subscribe(()=>{
      this.router.navigate(['/lists', this.listId]);
      this.openSnackBar('List updated successfully');
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
