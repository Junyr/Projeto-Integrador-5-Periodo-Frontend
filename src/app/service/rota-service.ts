import { Injectable } from '@angular/core';
import {Rota} from '../entity/Rota';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RotaService {

  private apiUrl = 'http://localhost:8080/rota';

  constructor(private http: HttpClient) {}

  listar(): Observable<Rota[]> {
    return this.http.get<Rota[]>(`${this.apiUrl}/listar`);
  }

  deletar(id: number) {
    return this.http.delete(`${this.apiUrl}/deletar/${id}`);
  }

}
