import {Component, OnInit} from '@angular/core';
import {Button} from 'primeng/button';
import {NgIf} from '@angular/common';
import {UsuarioInfo} from '../../entity/UsuarioInfo';
import {UsuarioService} from '../../service/usuario-service';
import {Router} from '@angular/router';
import { Toast } from 'primeng/toast';
import {MenuItem, MessageService} from 'primeng/api';
import {Menubar} from 'primeng/menubar';
import {Ripple} from 'primeng/ripple';


@Component({
  selector: 'app-header',
  imports: [
    Button,
    NgIf,
    Toast,
    Menubar,
    Ripple,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {

  protected usuario: UsuarioInfo | null = null;
  protected menuItems: MenuItem[] = [];

  constructor(
    private usuarioService: UsuarioService,
    private messageService: MessageService,
    private router: Router) {}

  ngOnInit(): void {
    this.menuItems = [
      {
        label: 'Itinerário',
        command: () => this.router.navigate(['itinerario']),
        disabled: this.isAtItinerario()
      },
      {
        label: 'Rota',
        command: () => this.router.navigate(['rota']),
        disabled: this.isAtRota()
      },
      {
        label: 'Ponto de Coleta',
        command: () => this.router.navigate(['pontoColeta']),
        disabled: this.isAtPonto()
      },
      {
        label: 'Caminhão',
        command: () => this.router.navigate(['caminhao']),
        disabled: this.isAtCaminhao()
      },
      {
        label: 'Residuo',
        command: () => this.router.navigate(['residuo']),
        disabled: this.isAtResiduo()
      },
      {
        label: 'Bairro',
        command: () => this.router.navigate(['bairro']),
        disabled: this.isAtBairro()
      },
      {
        label: 'Rua',
        command: () => this.router.navigate(['rua']),
        disabled: this.isAtRua()
      }
    ];

    this.usuarioService.usuarioInfo$.subscribe(u => {
      this.usuario = u;
    });
  }

  protected sair() {
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

  protected getIsAuthorized(): boolean {
    return this.usuarioService.getIsAuthorized();
  }

  protected isAtRota(): boolean {
    return this.router.url === '/rota';
  }

  protected isAtPonto(): boolean {
    return this.router.url === '/pontoColeta';
  }

  protected isAtCaminhao(): boolean {
    return this.router.url === '/caminhao';
  }

  protected isAtResiduo() {
    return this.router.url === '/residuo';
  }

  protected isAtBairro() {
    return this.router.url === '/bairro';
  }

  protected isAtRua() {
    return this.router.url === '/rua';
  }

  protected isAtItinerario() {
    return this.router.url === '/itinerario';
  }
}
