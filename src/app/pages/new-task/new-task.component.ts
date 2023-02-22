import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/task.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent implements OnInit {

  listId:string | any;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(
    private taskservice: TaskService, 
    private route: ActivatedRoute, 
    private router: Router,
    private _snackBar: MatSnackBar
  ) {

  }

  ngOnInit(): void {
    this.route.params.subscribe((params:any)=>{
      this.listId = params['listId'];
      
    })
  }
  
  createTask(title:string)
  {
    this.taskservice.createNewTask(title,this.listId).subscribe((newTask:Task | any)=>{

      this.router.navigate(['../'],{relativeTo: this.route});

      this.openSnackBar('Task created successfully');
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
