import { Injectable } from '@angular/core';
import { Task } from './models/task.model';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private webReqService: WebRequestService) { }

  createNewList(title: string)
  {
    return this.webReqService.post('lists',{title})
  }

  getLists()
  {
    return this.webReqService.get('lists');
  }

  getSingleList(listId: string)
  {
    return this.webReqService.get(`lists/${listId}`);
  }

  getTasks(listId: string)
  {
    return this.webReqService.get(`lists/${listId}/tasks`);
  }

  getSingleTask(listId: string, taskId: string)
  {
    return this.webReqService.get(`lists/${listId}/tasks/${taskId}`);
  }

  createNewTask(title:string, listId:string)
  {
    return this.webReqService.post(`lists/${listId}/tasks`,{title})
  }

  complete(task: Task)
  {
    return this.webReqService.patch(`lists/${task._listId}/tasks/${task._id}`,{
      completed: !task.completed
    })
  }

  deleteList(id:string)
  {
    return this.webReqService.delete(`lists/${id}`);
  }

  updateList(id: string, title:string)
  {
    return this.webReqService.patch(`lists/${id}`,{title})
  }

  deleteTask(listId:string, id:string)
  {
    return this.webReqService.delete(`lists/${listId}/tasks/${id}`);
  }

  updateTask(listId:string, id: string, title:string)
  {
    return this.webReqService.patch(`lists/${listId}/tasks/${id}`,{title})
  }
}
