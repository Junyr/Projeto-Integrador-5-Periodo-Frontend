import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Itinerario} from '../entity/Itinerario';

@Injectable({
  providedIn: 'root',
})
export class ItinerarioService {

  private apiUrl = 'http://localhost:8080/itinerario';

  constructor(private http: HttpClient) {}

  listar(): Observable<Itinerario[]> {
    return this.http.get<Itinerario[]>(`${this.apiUrl}/listar`);
  }

  buscar(id: number): Observable<Itinerario> {
    return this.http.get<Itinerario>(`${this.apiUrl}/buscar/${id}`);
  }

  adicionar(itinerario: Itinerario): Observable<Itinerario> {
    return this.http.post<Itinerario>(`${this.apiUrl}/adicionar`, itinerario);
  }

  atualizar(id: number, itinerario: Itinerario): Observable<Itinerario> {
    return this.http.put<Itinerario>(`${this.apiUrl}/atualizar/${id}`, itinerario);
  }

  deletar(id: number) {
    return this.http.delete(`${this.apiUrl}/deletar/${id}`);
  }
}
