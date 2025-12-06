import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Bairro} from '../entity/Bairro';

@Injectable({
  providedIn: 'root',
})
export class BairroService {

  private apiUrl = 'http://localhost:8080/bairros';

  constructor(private http: HttpClient) {}

  listar(): Observable<Bairro[]> {
    return this.http.get<Bairro[]>(`${this.apiUrl}/listar`);
  }

  buscar(id: number): Observable<Bairro> {
    return this.http.get<Bairro>(`${this.apiUrl}/buscar/${id}`);
  }

  adicionar(bairro: Bairro): Observable<Bairro> {
    return this.http.post<Bairro>(`${this.apiUrl}/adicionar`, bairro);
  }

  atualizar(id: number, bairro: Bairro): Observable<Bairro> {
    return this.http.put<Bairro>(`${this.apiUrl}/atualizar/${id}`, bairro);
  }

  deletar(id: number) {
    return this.http.delete(`${this.apiUrl}/deletar/${id}`);
  }

}
