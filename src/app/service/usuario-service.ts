import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, map, Observable, tap} from 'rxjs';
import {UsuarioRequestDTO} from '../entity/UsuarioRequestDTO';
import {Usuario} from '../entity/Usuario';
import {UsuarioInfo} from '../entity/UsuarioInfo';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {

  private baseUrl = 'http://localhost:8080/usuario';

  private authorized: boolean = false;

  private usuarioInfoSubject = new BehaviorSubject<UsuarioInfo | null>(null);
  usuarioInfo$ = this.usuarioInfoSubject.asObservable();

  constructor(private http: HttpClient) {}

  validarUsuario(usuario: UsuarioRequestDTO): Observable<boolean> {
    return this.http.post<UsuarioInfo>(`${this.baseUrl}/validar`, usuario).pipe(
      tap((usuarioRetornado: UsuarioInfo) => {
        if (usuarioRetornado) {
          this.authorized = true;
          this.usuarioInfoSubject.next(usuarioRetornado);
        }
      }),
      map(usuario => !!usuario)
    );
  }

  adicionarUsuario(usuario: Usuario): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/adicionar`, usuario )
  }

  logout(){
    this.authorized = false;
    this.usuarioInfoSubject.next(null);
  }

  getIsAuthorized(){
    return this.authorized;
  }

}
