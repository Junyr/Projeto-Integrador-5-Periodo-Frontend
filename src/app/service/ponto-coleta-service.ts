import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PontoColeta} from '../entity/PontoColeta';

@Injectable({
  providedIn: 'root',
})
export class PontoColetaService {

  private apiUrl = 'http://localhost:8080/ponto_coleta';

  constructor(private http: HttpClient) {}

  buscar(id: number): Observable<PontoColeta> {
    return this.http.get<PontoColeta>(`${this.apiUrl}/buscar/${id}`);
  }

  listar(): Observable<PontoColeta[]> {
    return this.http.get<PontoColeta[]>(`${this.apiUrl}/listar`);
  }

  adicionar(pontoColeta: PontoColeta): Observable<PontoColeta> {
    return this.http.post<PontoColeta>(`${this.apiUrl}/adicionar`, pontoColeta);
  }

  atualizar(id: number, pontoColeta: PontoColeta): Observable<PontoColeta> {
    return this.http.put<PontoColeta>(`${this.apiUrl}/atualizar/${id}`, pontoColeta);
  }

  deletar(id: number) {
    return this.http.delete(`${this.apiUrl}/deletar/${id}`);
  }

}
