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

  listar(): Observable<PontoColeta[]> {
    return this.http.get<PontoColeta[]>(`${this.apiUrl}/listar`);
  }

  deletar(id: number) {
    return this.http.delete(`${this.apiUrl}/deletar/${id}`);
  }

}
