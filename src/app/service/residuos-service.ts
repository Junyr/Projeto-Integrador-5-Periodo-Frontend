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

  buscar(id: number) {
    return this.http.get(`${this.apiUrl}/buscar/${id}`);
  }

  deletar(id: number) {
    return this.http.delete(`${this.apiUrl}/deletar/${id}`);
  }

}
