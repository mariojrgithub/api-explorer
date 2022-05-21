import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiEntry } from '../models/apientry';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl = "https://api.publicapis.org/entries";

  constructor(private http: HttpClient) { }

  public getApis(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }
}
