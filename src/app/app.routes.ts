import { Routes } from '@angular/router';
import { LoginComponent } from './components/usuario/login/login.component';
import { CadastroComponent } from './components/usuario/cadastro/cadastro.component';
import {authGuard} from './guards/auth-guard';
import {PontoColetaTable} from './components/pontoColeta/ponto-coleta-table/ponto-coleta-table';
import {PontoColetaForm} from './components/pontoColeta/ponto-coleta-form/ponto-coleta-form';
import {RotaTable} from './components/rota/rota-table/rota-table';
import {RotaForms} from './components/rota/rota-forms/rota-forms';
import {CaminhaoTable} from './components/caminhao/caminhao-table/caminhao-table';
import {CaminhaoForm} from './components/caminhao/caminhao-form/caminhao-form';
import {BairroForm} from './components/bairro/bairro-form/bairro-form';
import {BairroTable} from './components/bairro/bairro-table/bairro-table';

export const routes: Routes = [
  { path: '', redirectTo: 'rota', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'rota', component: RotaTable/**, canActivate: [authGuard]*/ },
  { path: 'rota/adicionar', component: RotaForms/**, canActivate: [authGuard]*/ },
  { path: 'rota/atualizar/:id', component: RotaForms/**, canActivate: [authGuard]*/ },
  { path: 'pontoColeta', component: PontoColetaTable/**, canActivate: [authGuard]*/ },
  { path: 'pontoColeta/adicionar', component: PontoColetaForm/**, canActivate: [authGuard]*/ },
  { path: 'pontoColeta/atualizar/:id', component: PontoColetaForm/**, canActivate: [authGuard]*/ },
  { path: 'caminhao', component: CaminhaoTable/**, canActivate: [authGuard]*/ },
  { path: 'caminhao/adicionar', component: CaminhaoForm/**, canActivate: [authGuard]*/ },
  { path: 'caminhao/atualizar/:id', component: CaminhaoForm/**, canActivate: [authGuard]*/ },
  { path: 'bairro', component: BairroTable/**, canActivate: [authGuard]*/ },
  { path: 'bairro/adicionar', component: BairroForm/**, canActivate: [authGuard]*/ },
  { path: 'bairro/atualizar/:id', component: BairroForm/**, canActivate: [authGuard]*/ }
];
