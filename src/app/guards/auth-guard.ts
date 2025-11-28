import {CanActivateFn, Router} from '@angular/router';
import {UsuarioService} from '../service/usuario-service';
import {inject} from '@angular/core';
import { MessageService } from 'primeng/api';

export const authGuard: CanActivateFn = () => {

  const usuarioService = inject(UsuarioService);
  const router = inject(Router);
  const messageService: MessageService = inject(MessageService);

  if(!usuarioService.getIsAuthorized()){
    messageService.add({
      severity: 'warn',
      summary: 'Acesso negado',
      detail: 'Faça o login primeiro!'
    });

    router.navigate(['/login']);
    return false;
  }

  return true;
};
