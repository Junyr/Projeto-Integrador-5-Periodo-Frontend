import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Rua} from '../entity/Rua';
import {RuaRequestDTO} from '../entity/RuaRequestDTO';

@Injectable({
  providedIn: 'root',
})
export class RuasService {

  private apiUrl = 'http://localhost:8080/ruas';

  constructor(private http: HttpClient) {}

  listar(): Observable<Rua[]> {
    return this.http.get<Rua[]>(`${this.apiUrl}/listar`);
  }

  buscar(id: number): Observable<Rua> {
    return this.http.get<Rua>(`${this.apiUrl}/buscar/${id}`);
  }

  adicionar(ruaRequest: RuaRequestDTO): Observable<Rua> {
    return this.http.post<Rua>(`${this.apiUrl}/adicionar`, ruaRequest);
  }

  atualizar(id: number, ruaRequest: RuaRequestDTO): Observable<Rua> {
    return this.http.put<Rua>(`${this.apiUrl}/atualizar/${id}`, ruaRequest);
  }

  deletar(id: number) {
    return this.http.delete(`${this.apiUrl}/deletar/${id}`);
  }

}
