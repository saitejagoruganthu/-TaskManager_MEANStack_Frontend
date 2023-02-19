import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from 'src/app/task.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss']
})
export class EditTaskComponent {

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
  taskId: string | any;
  currentTaskTitle: string | any;
  
  ngOnInit(): void {

    this.route.params.subscribe((params:any)=>{
      this.taskId = params.taskId;
      this.listId = params.listId;
    })

    this.taskservice.getSingleTask(this.listId, this.taskId).subscribe((res)=>{
      
      this.currentTaskTitle = Object.values(res)[0].title;
    })

  }

  updateTask(title: string)
  {
    this.taskservice.updateTask(this.listId,this.taskId,title).subscribe(()=>{
      this.router.navigate(['/lists', this.listId]);
      this.openSnackBar('Task updated successfully');
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
