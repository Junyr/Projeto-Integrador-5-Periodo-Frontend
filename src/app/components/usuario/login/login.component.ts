import { Component } from '@angular/core';
import {Card} from 'primeng/card';
import {InputText} from 'primeng/inputtext';
import {FormsModule} from '@angular/forms';
import {Button} from 'primeng/button';
import {UsuarioRequestDTO} from '../../../entity/UsuarioRequestDTO';
import {UsuarioService} from '../../../service/usuario-service';
import {Router} from '@angular/router';
import { Toast } from 'primeng/toast';
import {MessageService} from 'primeng/api';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    Card,
    InputText,
    FormsModule,
    Button,
    Toast
  ],
  templateUrl: './login.component.html',
  styleUrl: '../../../template/templateForm.scss',
})

export class LoginComponent {

  usuario: UsuarioRequestDTO = {
    email: '',
    senha: ''
  };

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private messageService: MessageService) {}

  protected login() {
    this.usuarioService.validarUsuario(this.usuario).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Usuário logado com sucesso!'
        });

        setTimeout(() => {
          this.router.navigate(['home']);
        }, 0);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err.error?.message || 'Erro ao logar!'
        });
      }
    });
  }

  protected cadastrar() {
    this.router.navigate(['cadastro']);
  }
}
