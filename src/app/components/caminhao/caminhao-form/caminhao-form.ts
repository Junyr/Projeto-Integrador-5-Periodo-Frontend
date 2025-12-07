import {Component, OnInit} from '@angular/core';
import {Button} from 'primeng/button';
import {Card} from 'primeng/card';
import {InputText} from 'primeng/inputtext';
import {MultiSelect} from 'primeng/multiselect';
import {MessageService, PrimeTemplate} from 'primeng/api';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Toast} from 'primeng/toast';
import {Residuo} from '../../../entity/Residuo';
import {ResiduosService} from '../../../service/residuos-service';
import {ActivatedRoute, Router} from '@angular/router';
import {Caminhao} from '../../../entity/Caminhao';
import {InputNumberModule} from 'primeng/inputnumber';
import {CaminhaoService} from '../../../service/caminhao-service';
import {FormComponent} from '../../../entity/FormComponent';

@Component({
  selector: 'app-caminhao-form',
  imports: [
    Button,
    Card,
    InputText,
    MultiSelect,
    PrimeTemplate,
    ReactiveFormsModule,
    Toast,
    InputNumberModule,
    FormsModule
  ],
  templateUrl: './caminhao-form.html',
  styleUrl: '../../../template/templateForm.scss',
})
export class CaminhaoForm implements OnInit, FormComponent {

  caminhao: Caminhao = {
    placa: '',
    motorista: '',
    capacidade: 0,
    tiposResiduos: []
  };

  formAtualizar: boolean = false;
  isSalvo: boolean = false;

  residuoDisponivel: Residuo[] = [];
  residuoSelecionado: Residuo[] = [];

  constructor(
    private residuoService: ResiduosService,
    private caminhaoService: CaminhaoService,
    private router: Router,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    if(id != null) {
      this.caminhaoService.buscar(id).subscribe(caminhao => {
        this.caminhao = caminhao;

        this.caminhao.tiposResiduos.forEach(idResiduo => {
          this.residuoService.buscar(idResiduo).subscribe(residuo => {
            this.residuoSelecionado.push(residuo);
          });
        });
      });

      this.formAtualizar = true;
    }

    this.residuoService.listar().subscribe(residuos => {
      this.residuoDisponivel = residuos;
    });
  }

  protected cadastrar() {
    this.caminhao.tiposResiduos = this.residuoSelecionado.map(r => r.id!);

    this.caminhaoService.adicionar(this.caminhao).subscribe({
      next: () => {
        this.isSalvo = true;
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Caminhão cadastrado com sucesso!'
        });

        setTimeout(() => {
          this.router.navigate(['caminhao']);
        }, 0);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err.error?.message || 'Erro ao cadastrar caminhão!'
        });
      }
    })
  }

  protected atualizar() {
    const id = this.activatedRoute.snapshot.params['id'];
    this.caminhao.tiposResiduos = this.residuoSelecionado.map(r => r.id!);

    this.caminhaoService.atualizar(id, this.caminhao).subscribe({
      next: () => {
        this.isSalvo = true;
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Caminhão atualizado com sucesso!'
        });

        setTimeout(() => {
          this.router.navigate(['caminhao']);
        }, 0);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err.error?.message || 'Erro ao atualizar caminhão!'
        });
      }
    })
  }

  protected voltar() {
    this.router.navigate(['caminhao']);
  }
}
