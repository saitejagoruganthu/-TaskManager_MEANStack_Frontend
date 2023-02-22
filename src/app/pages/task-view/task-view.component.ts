import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { List } from 'src/app/models/list.model';
import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/task.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent implements OnInit, OnDestroy {

  lists: List[] | any;
  tasks: Task[] | any;
  currentListName: string | any;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  mobileQuery: MediaQueryList | any;

  selectedListId: string | any;

  private _mobileQueryListener: () => void;

  constructor(
    private taskservice: TaskService,
    private route: ActivatedRoute,
    private router: Router,
    private authservice: AuthService,
    private _snackBar: MatSnackBar,
    changeDetectorRef: ChangeDetectorRef, 
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 767px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
   }

  ngOnInit(): void {
    this.taskservice.getLists().subscribe((lists:List[] | any)=>{
      this.lists = lists;
    })

    this.route.params.subscribe((params:any)=>{
      if(params.listId)
      {
        this.selectedListId = params.listId;
        
        this.taskservice.getSingleList(params.listId).subscribe((res)=>{
          this.currentListName = Object.values(res)[0].title;
        })

        this.taskservice.getTasks(params.listId).subscribe((tasks:Task[] | any)=>{
          this.tasks = tasks;
        })
      }
      else
      {
        this.tasks = undefined;
      }
    })
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  onTaskClick(task: Task)
  {
    //we want to set the task completed
    this.taskservice.complete(task).subscribe((res)=>{
      task.completed = !task.completed;
      if(task.completed)
      {
        this.openSnackBar('Task marked as complete. Click on it again to undo');
      }
      else
      {
        this.openSnackBar('Task marked as incomplete. Click on it again to undo');
      }
      
    })
  }

  onDeleteListClick()
  {
    this.taskservice.deleteList(this.selectedListId).subscribe((res)=>{
      this.router.navigate(['/lists']);
      this.openSnackBar('List deleted successfully');
    })
  }

  onTaskDeleteClick(id:string)
  {
    this.taskservice.deleteTask(this.selectedListId, id).subscribe((res)=>{
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
