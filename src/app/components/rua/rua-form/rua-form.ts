import {Component, OnInit} from '@angular/core';
import {Button} from 'primeng/button';
import {Card} from 'primeng/card';
import {MessageService, PrimeTemplate} from 'primeng/api';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Toast} from 'primeng/toast';
import {ActivatedRoute, Router} from '@angular/router';
import {Select} from 'primeng/select';
import {InputNumber} from 'primeng/inputnumber';
import {Rua} from '../../../entity/Rua';
import {RuasService} from '../../../service/ruas-service';
import {Bairro} from '../../../entity/Bairro';
import {BairroService} from '../../../service/bairro-service';
import {RuaRequestDTO} from '../../../entity/RuaRequestDTO';
import {FormComponent} from '../../../entity/FormComponent';

@Component({
  selector: 'app-rua-form',
  imports: [
    Button,
    Card,
    PrimeTemplate,
    ReactiveFormsModule,
    Toast,
    FormsModule,
    Select,
    InputNumber
  ],
  templateUrl: './rua-form.html',
  styleUrl: '../../../template/templateForm.scss',
})
export class RuaForm implements OnInit, FormComponent {

  rua: Rua = {
    origem: {
      nome: ''
    },
    destino: {
      nome: ''
    },
    distanciaKm: 0
  };

  ruaRequest: RuaRequestDTO = {
    origemId: 0,
    destinoId: 0,
    distanciaKm: 0
  };

  formAtualizar: boolean = false;
  isSalvo: boolean = false;

  bairroDisponivel: Bairro[] = [];
  BairroDisponivelFiltrado: Bairro[] = [];

  bairroOrigemSelecionado!: Bairro;
  bairroDestinoSelecionado!: Bairro;

  constructor(
    private ruaService: RuasService,
    private bairroService: BairroService,
    private router: Router,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    if(id != null) {
      this.ruaService.buscar(id).subscribe(rua => {
        this.rua = rua;

        this.bairroOrigemSelecionado = rua.origem;
        this.OnSelectionOrigem();

        this.bairroDestinoSelecionado = rua.destino;
      })

      this.formAtualizar = true;
    }

    this.bairroService.listar().subscribe(bairro => {
      this.bairroDisponivel = bairro;
    })
  }

  protected cadastrar() {
    this.ruaRequest.origemId = this.bairroOrigemSelecionado.id!;
    this.ruaRequest.destinoId = this.bairroDestinoSelecionado.id!;
    this.ruaRequest.distanciaKm = this.rua.distanciaKm!;

    this.ruaService.adicionar(this.ruaRequest).subscribe({
      next: () => {
        this.isSalvo = true;
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Rua cadastrado com sucesso!'
        });

        setTimeout(() => {
          this.router.navigate(['rua']);
        }, 0);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err.error?.message || 'Erro ao cadastrar rua!'
        });
      }
    })
  }

  protected atualizar() {
    const id = this.activatedRoute.snapshot.params['id'];
    this.ruaRequest.origemId = this.bairroOrigemSelecionado.id!;
    this.ruaRequest.destinoId = this.bairroDestinoSelecionado.id!;
    this.ruaRequest.distanciaKm = this.rua.distanciaKm;

    this.ruaService.atualizar(id, this.ruaRequest).subscribe({
      next: () => {
        this.isSalvo = true;
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Rua atualizado com sucesso!'
        });

        setTimeout(() => {
          this.router.navigate(['rua']);
        }, 0);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err.error?.message || 'Erro ao atualizar rua!'
        });
      }
    })
  }

  protected voltar() {
    this.router.navigate(['rua']);
  }

  protected OnSelectionOrigem() {
    this.BairroDisponivelFiltrado = [];
    this.BairroDisponivelFiltrado = this.bairroDisponivel
      .filter(b => b.id !== this.bairroOrigemSelecionado.id);
  }
}
