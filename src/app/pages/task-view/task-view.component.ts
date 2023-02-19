import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { List } from 'src/app/models/list.model';
import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/task.service';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent implements OnInit {

  lists: List[] | any;
  tasks: Task[] | any;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  selectedListId: string | any;

  constructor(
    private taskservice: TaskService,
    private route: ActivatedRoute,
    private router: Router,
    private authservice: AuthService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.taskservice.getLists().subscribe((lists:List[] | any)=>{
      this.lists = lists;
    })

    this.route.params.subscribe((params:any)=>{
      //console.log(params);
      if(params.listId)
      {
        this.selectedListId = params.listId;
        this.taskservice.getTasks(params.listId).subscribe((tasks:Task[] | any)=>{
          this.tasks = tasks;
          //console.log(this.tasks)
        })
      }
      else
      {
        this.tasks = undefined;
      }
    })
  }

  onTaskClick(task: Task)
  {
    //we want to set the task completed
    this.taskservice.complete(task).subscribe((res)=>{
      //console.log(res);
      task.completed = !task.completed
    })
  }

  onDeleteListClick()
  {
    this.taskservice.deleteList(this.selectedListId).subscribe((res)=>{
      //console.log(res);
      this.router.navigate(['/lists']);
      this.openSnackBar('List deleted successfully');
    })
  }

  onTaskDeleteClick(id:string)
  {
    this.taskservice.deleteTask(this.selectedListId, id).subscribe((res)=>{
      //console.log(res);
      this.tasks = this.tasks.filter((val:any) => val._id !== id)
      this.openSnackBar('Task deleted successfully');
    })
  }

  logout()
  {
    this.authservice.logout();
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  openSnackBar(content:string) {
    this._snackBar.open(content, 'Close', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 3000
    });
  }
}
