import { Component } from '@angular/core';
import {Button} from 'primeng/button';
import {NgIf} from '@angular/common';
import {UsuarioInfo} from '../../entity/UsuarioInfo';
import {UsuarioService} from '../../service/usuario-service';
import { Router } from '@angular/router';
import { Toast } from 'primeng/toast';
import {MessageService} from 'primeng/api';


@Component({
  selector: 'app-header',
  imports: [
    Button,
    NgIf,
    Toast
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {

  usuario: UsuarioInfo | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private messageService: MessageService,
    private router: Router) {
    this.usuarioService.usuarioInfo$.subscribe(u => {
      this.usuario = u;
    });
  }

  sair() {
    this.usuarioService.logout();
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Usuário deslogado com sucesso!'
    });

    setTimeout(() => {
      this.router.navigate(['login']);
    }, 0);
  }

  getIsAuthorized(): boolean {
    return this.usuarioService.getIsAuthorized();
  }

}
