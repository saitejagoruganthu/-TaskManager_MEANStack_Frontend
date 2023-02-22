import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WebRequestService {

  readonly RootURL:any;

  constructor(private http: HttpClient) {
    this.RootURL = 'https://mean-task-manager.adaptable.app';
  }

  get(url:string)
  {
    return this.http.get(`${this.RootURL}/${url}`);
  }

  post(url: string, payload: Object)
  {
    return this.http.post(`${this.RootURL}/${url}`, payload);
  }

  patch(url: string, payload: Object)
  {
    return this.http.patch(`${this.RootURL}/${url}`, payload);
  }

  delete(url:string)
  {
    return this.http.delete(`${this.RootURL}/${url}`);
  }

  login(email: string, password:string)
  {
    return this.http.post(`${this.RootURL}/users/login`,{
      email,
      password
    }, {
      observe: 'response'
    })
  }

  signup(email: string, password:string)
  {
    return this.http.post(`${this.RootURL}/users`,{
      email,
      password
    }, {
      observe: 'response'
    })
  }
}
