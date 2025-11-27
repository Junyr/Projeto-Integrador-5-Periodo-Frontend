import { Component } from '@angular/core';
import {Card} from 'primeng/card';
import {InputText} from 'primeng/inputtext';
import {FormsModule} from '@angular/forms';
import {Button} from 'primeng/button';
import {UsuarioRequestDTO} from '../../../entity/UsuarioRequestDTO';
import {UsuarioService} from '../../../service/usuario-service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    Card,
    InputText,
    FormsModule,
    Button
  ],
  templateUrl: './login.component.html',
  styleUrl: '../../../template/templateForm.scss',
})

export class LoginComponent {

  usuario: UsuarioRequestDTO = new UsuarioRequestDTO();

  constructor(private usuarioService: UsuarioService, private router: Router) {
  }

  protected login() {
    this.usuarioService.validarUsuario(this.usuario).subscribe({
      next: result => {
        this.router.navigate(['cadastro']);
      },
      error: error => {
        console.log(error);
      }
    });
  }

  protected cadastrar() {
    this.router.navigate(['cadastro']);
  }
}
