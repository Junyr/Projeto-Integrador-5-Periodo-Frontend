import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Caminhao} from '../entity/Caminhao';

@Injectable({
  providedIn: 'root',
})
export class CaminhaoService {

  private apiUrl = 'http://localhost:8080/caminhao';

  constructor(private http: HttpClient) {}

  listar(): Observable<Caminhao[]> {
    return this.http.get<Caminhao[]>(`${this.apiUrl}/listar`);
  }

  buscar(id: number): Observable<Caminhao> {
    return this.http.get<Caminhao>(`${this.apiUrl}/buscar/${id}`);
  }

  adicionar(caminhao: Caminhao): Observable<Caminhao> {
    return this.http.post<Caminhao>(`${this.apiUrl}/adicionar`, caminhao);
  }

  atualizar(id: number, caminhao: Caminhao): Observable<Caminhao> {
    return this.http.put<Caminhao>(`${this.apiUrl}/atualizar/${id}`, caminhao);
  }

  deletar(id: number) {
    return this.http.delete(`${this.apiUrl}/deletar/${id}`);
  }

}
