import {Component, OnInit} from '@angular/core';
import {Button} from "primeng/button";
import {Card} from "primeng/card";
import {FormsModule} from "@angular/forms";
import {InputText} from "primeng/inputtext";
import {MessageService, PrimeTemplate} from "primeng/api";
import {Toast} from "primeng/toast";
import {ActivatedRoute, Router} from '@angular/router';
import {Residuo} from '../../../entity/Residuo';
import {ResiduosService} from '../../../service/residuos-service';

@Component({
  selector: 'app-residuo-form',
    imports: [
        Button,
        Card,
        FormsModule,
        InputText,
        PrimeTemplate,
        Toast
    ],
  templateUrl: './residuo-form.html',
  styleUrl: '../../../template/templateForm.scss',
})
export class ResiduoForm implements OnInit {

  residuo: Residuo = {
    tipo: ''
  };

  formAtualizar: boolean = false;

  constructor(
    private residuoService: ResiduosService,
    private router: Router,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    if(id != null) {
      this.residuoService.buscar(id).subscribe(residuo => {
        this.residuo = residuo;
      })

      this.formAtualizar = true;
    }
  }

  protected cadastrar() {
    this.residuoService.adicionar(this.residuo).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Residuo cadastrado com sucesso!'
        });

        setTimeout(() => {
          this.router.navigate(['residuo']);
        }, 1500);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err.error?.message || 'Erro ao cadastrar residuo'
        });
      }
    })
  }

  protected atualizar() {
    const id = this.activatedRoute.snapshot.params['id'];

    this.residuoService.atualizar(id, this.residuo).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Residuo atualizado com sucesso!'
        });

        setTimeout(() => {
          this.router.navigate(['residuo']);
        }, 1500);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err.error?.message || 'Erro ao atualizar residuo'
        });
      }
    })
  }

  protected voltar() {
    this.router.navigate(['residuo']);
  }

}
