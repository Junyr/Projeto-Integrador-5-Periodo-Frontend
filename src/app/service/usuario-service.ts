import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UsuarioRequestDTO} from '../entity/UsuarioRequestDTO';
import {Usuario} from '../entity/Usuario';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {

  private baseUrl = 'http://localhost:8080/usuario';

  constructor(private http: HttpClient) {}

  validarUsuario(usuario: UsuarioRequestDTO): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseUrl}/validar`, usuario )
  }

  adicionarUsuario(usuario: Usuario): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/adicionar`, usuario )
  }

}
