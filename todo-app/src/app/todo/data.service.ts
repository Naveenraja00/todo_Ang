import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Rx';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class DataService {
  baseUrl: string = 'localho.st:9008/';

  constructor(private http: HttpClient) {}

  getdays(): Observable<any> {
    return this.http
      .get(this.baseUrl + 'todo')
      .pipe(catchError(this.handleError));
  }

  gettask(date: Date) {
    return this.http.get<any[]>(this.baseUrl + 'todo/:' + date).pipe(
      map((items) => {
        let item = items.filter((list) => list.date === date);
        console.log(item[0]);
        return item && item.length ? item : null;
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('server error:', error);
    if (error.error instanceof Error) {
      const errMessage = error.error.message;
      return Observable.throw(errMessage);
      // Use the following instead if using lite-server
      // return Observable.throw(err.text() || 'backend server error');
    }
    return Observable.throw(error || 'Node.js server error');
  }
}
