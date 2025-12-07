import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { ToastModule } from 'primeng/toast';
import {ConfirmDialog} from 'primeng/confirmdialog';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, ToastModule, ConfirmDialog],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Projeto-Integrador-5-Periodo-Frontend');
}
