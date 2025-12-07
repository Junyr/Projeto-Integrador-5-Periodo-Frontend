import { CanDeactivateFn } from '@angular/router';
import {ConfirmationService} from 'primeng/api';
import {inject} from '@angular/core';
import {FormComponent} from '../entity/FormComponent';

export const warningFormGuard: CanDeactivateFn<FormComponent> = (component, currentRoute, currentState, nextState) => {
  if(!component.isSalvo) {
    const confirmationService = inject(ConfirmationService);

    return new Promise<boolean>((resolve) => {
      confirmationService.confirm({
        message: 'Existem alterações não salvas. Deseja realmente sair?',
        header: 'Confirmação',
        icon: 'pi pi-exclamation-triangle',

        rejectLabel: 'Não',
        acceptLabel: 'Sim',

        reject: () => resolve(false),
        accept: () => resolve(true)
      });
    });
  }
  return true;
};
