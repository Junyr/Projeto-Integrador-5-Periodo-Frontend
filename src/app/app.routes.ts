import { Routes } from '@angular/router';
import { LoginComponent } from './components/usuario/login/login.component';
import { CadastroComponent } from './components/usuario/cadastro/cadastro.component';
import {HomeComponent} from './components/pontoColeta/home/home.component';
import {authGuard} from './guards/auth-guard';
import {
  RotaAtualizarFormularioComponent
} from './components/pontoColeta/rota-atualizar-formulario/rota-atualizar-formulario.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'home', component: HomeComponent/**, canActivate: [authGuard]*/ },
  { path: 'rota/atualizar/:id', component: RotaAtualizarFormularioComponent/**, canActivate: [authGuard]*/ }
];
