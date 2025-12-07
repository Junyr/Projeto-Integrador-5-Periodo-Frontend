import { Component } from '@angular/core';
import {InputText} from 'primeng/inputtext';
import {FormsModule} from '@angular/forms';
import {Button} from 'primeng/button';
import {Usuario} from '../../../entity/Usuario';
import {Card} from 'primeng/card';
import {UsuarioService} from '../../../service/usuario-service';
import {Router} from '@angular/router';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import {FormComponent} from '../../../entity/FormComponent';


@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [
    InputText,
    FormsModule,
    Button,
    Card,
    Toast
  ],
  templateUrl: './cadastro.component.html',
  styleUrl: '../../../template/templateForm.scss',
})
export class CadastroComponent implements FormComponent{

  protected usuario: Usuario = {
    email: '',
    nome: '',
    senha: ''
  };

  isSalvo: boolean = false;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private messageService: MessageService) { }

  protected cadastrar() {
    this.usuarioService.adicionarUsuario(this.usuario).subscribe({
      next: () => {
        this.isSalvo = true;
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Usuário cadastrado com sucesso!'
        });

        setTimeout(() => {
          this.router.navigate(['login']);
        }, 0);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err.error?.message || 'Erro ao cadastrar usuário!'
        });
      }
    })
  }

  protected voltar() {
    this.router.navigate(['login']);
  }
}
