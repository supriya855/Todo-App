import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { todoDetails } from '../todo/_models/todoDetails.model';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class TodoserviceService {

  apiUrl!: string;
  constructor(private httpClient: HttpClient) {
    this.apiUrl = environment.todoApiUrl
   }
  generateObjectId(): string {
    // Generate a timestamp (4-byte)
    const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');

    // Generate a random value (5-byte)
    const random = [...Array(10)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

    // Generate an incrementing counter (3-byte)
    const counter = Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');

    // Concatenate the components and return
    return timestamp + random + counter;
  }

  todoDataFetch(): Observable<any> {
    return this.httpClient.get<todoDetails[]>(this.apiUrl + 'api/Todo')
    .pipe(
      map((result: any) => {
        if (result?.resultsetData?.length > 0) {
          // console.log(result.resultsetData);
          return result.resultsetData;
        }
        else {
          return of([]);
        }
      }
      )
    );
}
  todoCreateFetch(task:any): Observable<any> {
    let requestpayload = {
    "uniqueId": this.generateObjectId(),
    "task": task ? task : '',
    "status": "in progress"
    }
    return this.httpClient.post<todoDetails>(this.apiUrl + 'api/Todo',requestpayload)
    .pipe(
      map((result: any) => {
          return result.resultsetData;
      }
    ));
  }
  todoUpdateFetch(uniqueId:string, updatedTaskValue:string, updatedStatusvalue : string): Observable<any> {
    const requestpayload ={
      uniqueId: uniqueId,
      task: updatedTaskValue,
      status:updatedStatusvalue
    }
    return this.httpClient.put<todoDetails>(this.apiUrl + `api/Todo/${uniqueId}`, requestpayload)
    .pipe(
      map((result: any) => {
          return result.resultsetData;
      }
    ));
  }

  todoDeleteFetch(uniqueId: string): Observable<any> {
    return this.httpClient.delete(this.apiUrl + `api/Todo/${uniqueId}`)
    .pipe(
      map((result: any) => {
          return result;
      }
    ));
  }
}

