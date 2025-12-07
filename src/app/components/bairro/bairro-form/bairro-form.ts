import {Component, OnInit} from '@angular/core';
import {Button} from 'primeng/button';
import {Card} from 'primeng/card';
import {InputText} from 'primeng/inputtext';
import {MessageService, PrimeTemplate} from 'primeng/api';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Toast} from 'primeng/toast';
import {ActivatedRoute, Router} from '@angular/router';
import {Bairro} from '../../../entity/Bairro';
import {BairroService} from '../../../service/bairro-service';
import {FormComponent} from '../../../entity/FormComponent';

@Component({
  selector: 'app-bairro-form',
  imports: [
    Button,
    Card,
    InputText,
    PrimeTemplate,
    ReactiveFormsModule,
    Toast,
    FormsModule
  ],
  templateUrl: './bairro-form.html',
  styleUrl: '../../../template/templateForm.scss',
})
export class BairroForm implements OnInit, FormComponent {

  bairro: Bairro = {
    nome: ''
  };

  formAtualizar: boolean = false;
  isSalvo: boolean = false;

  constructor(
    private bairroService: BairroService,
    private router: Router,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    if(id != null) {
      this.bairroService.buscar(id).subscribe(bairro => {
        this.bairro = bairro;
      })

      this.formAtualizar = true;
    }
  }

  protected cadastrar() {
    this.bairroService.adicionar(this.bairro).subscribe({
      next: () => {
        this.isSalvo = true;
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Bairro cadastrado com sucesso!'
        });

        setTimeout(() => {
          this.router.navigate(['bairro']);
        }, 0);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err.error?.message || 'Erro ao cadastrar bairro!'
        });
      }
    })
  }

  protected atualizar() {
    const id = this.activatedRoute.snapshot.params['id'];

    this.bairroService.atualizar(id, this.bairro).subscribe({
      next: () => {
        this.isSalvo = true;
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Bairro atualizado com sucesso!'
        });

        setTimeout(() => {
          this.router.navigate(['bairro']);
        }, 0);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err.error?.message || 'Erro ao atualizar bairro!'
        });
      }
    })
  }

  protected voltar() {
    this.router.navigate(['bairro']);
  }

}
