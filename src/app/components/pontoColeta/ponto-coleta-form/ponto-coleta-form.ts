import {Component, OnInit} from '@angular/core';
import {Button} from "primeng/button";
import {Card} from "primeng/card";
import {FormsModule} from "@angular/forms";
import {InputText} from "primeng/inputtext";
import {Toast} from "primeng/toast";
import {ActivatedRoute, Router} from '@angular/router';
import {MessageService, PrimeTemplate} from 'primeng/api';
import {PontoColeta} from '../../../entity/PontoColeta';
import {PontoColetaService} from '../../../service/ponto-coleta-service';
import {Select} from 'primeng/select';
import {Bairro} from '../../../entity/Bairro';
import {BairroService} from '../../../service/bairro-service';
import {MultiSelect} from 'primeng/multiselect';
import {Residuo} from '../../../entity/Residuo';
import {ResiduosService} from '../../../service/residuos-service';

@Component({
  selector: 'app-ponto-coleta-form',
  imports: [
    Button,
    Card,
    FormsModule,
    InputText,
    Toast,
    Select,
    MultiSelect,
    PrimeTemplate
  ],
  templateUrl: './ponto-coleta-form.html',
  styleUrl: '../../../template/templateForm.scss',
})
export class PontoColetaForm implements OnInit {

  pontoColeta: PontoColeta = {
    nome: '',
    responsavel: '',
    telefoneResponsavel: '',
    emailResponsavel: '',
    endereco: '',
    horario: '',
    bairroId: 0,
    tiposResiduos: []
  };

  formAtualizar: boolean = false;

  bairroDisponivel: Bairro[] = [];
  bairroSelecionado!: Bairro;

  residuoDisponivel: Residuo[] = [];
  residuoSelecionado: Residuo[] = [];

  constructor(
    private pontoColetaService: PontoColetaService,
    private residuoService: ResiduosService,
    private bairroService: BairroService,
    private router: Router,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    if(id != null) {
      this.pontoColetaService.buscar(id).subscribe(pontoColeta => {
        this.pontoColeta = pontoColeta;

        this.bairroService.buscar(this.pontoColeta.bairroId).subscribe(bairro => {
          this.bairroSelecionado = bairro;
        });

        this.pontoColeta.tiposResiduos.forEach(idResiduo => {
          this.residuoService.buscar(idResiduo).subscribe(residuo => {
            this.residuoSelecionado.push(residuo);
          });
        });
      });

      this.formAtualizar = true;
    }

    this.bairroService.listar().subscribe(bairros => {
      this.bairroDisponivel = bairros;
    });

    this.residuoService.listar().subscribe(residuos => {
      this.residuoDisponivel = residuos;
    });
  }

  protected cadastrar() {
    this.pontoColeta.bairroId = this.bairroSelecionado.id!;
    this.pontoColeta.tiposResiduos = this.residuoSelecionado.map(r => r.id!);

    this.pontoColetaService.adicionar(this.pontoColeta).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Ponto de coleta cadastrado com sucesso!'
        });

        setTimeout(() => {
          this.router.navigate(['pontoColeta']);
        }, 1500);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err.error?.message || 'Erro ao cadastrar ponto de colta'
        });
      }
    })
  }

  protected atualizar() {
    const id = this.activatedRoute.snapshot.params['id'];
    this.pontoColeta.bairroId = this.bairroSelecionado.id!;
    this.pontoColeta.tiposResiduos = this.residuoSelecionado.map(r => r.id!);

    this.pontoColetaService.atualizar(id, this.pontoColeta).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Ponto de coleta atualizado com sucesso!'
        });

        setTimeout(() => {
          this.router.navigate(['pontoColeta']);
        }, 1500);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err.error?.message || 'Erro ao atualizar ponto de colta'
        });
      }
    })
  }

  protected voltar() {
    this.router.navigate(['pontoColeta']);
  }
}
