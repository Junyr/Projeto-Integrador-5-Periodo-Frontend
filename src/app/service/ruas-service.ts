import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Rua} from '../entity/Rua';

@Injectable({
  providedIn: 'root',
})
export class RuasService {

  private apiUrl = 'http://localhost:8080/ruas';

  constructor(private http: HttpClient) {}

  listar(): Observable<Rua[]> {
    return this.http.get<Rua[]>(`${this.apiUrl}/listar`);
  }

  deletar(id: number) {
    return this.http.delete(`${this.apiUrl}/deletar/${id}`);
  }

}
