import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Residuo} from '../entity/Residuo';

@Injectable({
  providedIn: 'root',
})
export class ResiduosService {

  private apiUrl = 'http://localhost:8080/residuo';

  constructor(private http: HttpClient) {}

  listar(): Observable<Residuo[]> {
    return this.http.get<Residuo[]>(`${this.apiUrl}/listar`);
  }

  buscar(id: number): Observable<Residuo> {
    return this.http.get<Residuo>(`${this.apiUrl}/buscar/${id}`);
  }

  adicionar(residuo: Residuo): Observable<Residuo> {
    return this.http.post<Residuo>(`${this.apiUrl}/adicionar`, residuo);
  }

  atualizar(id: number, residuo: Residuo): Observable<Residuo> {
    return this.http.put<Residuo>(`${this.apiUrl}/atualizar/${id}`, residuo);
  }

  deletar(id: number) {
    return this.http.delete(`${this.apiUrl}/deletar/${id}`);
  }

}
