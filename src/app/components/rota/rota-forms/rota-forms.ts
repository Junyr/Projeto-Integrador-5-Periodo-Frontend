import {Component, OnInit} from '@angular/core';
import {Card} from "primeng/card";
import {FormsModule} from "@angular/forms";
import {Toast} from "primeng/toast";
import {PontoColeta} from '../../../entity/PontoColeta';
import {Residuo} from '../../../entity/Residuo';
import {Caminhao} from '../../../entity/Caminhao';
import {ActivatedRoute, Router} from '@angular/router';
import {RotaService} from '../../../service/rota-service';
import {CaminhaoService} from '../../../service/caminhao-service';
import {PontoColetaService} from '../../../service/ponto-coleta-service';
import {Rota} from '../../../entity/Rota';
import {Select} from 'primeng/select';
import {MultiSelect} from 'primeng/multiselect';
import {Button} from 'primeng/button';
import {InputText} from 'primeng/inputtext';
import {ResiduosService} from '../../../service/residuos-service';
import {MessageService, PrimeTemplate} from 'primeng/api';
import {RotaRequestDTO} from '../../../entity/RotaRequestDTO';

@Component({
  selector: 'app-rota-forms',
  imports: [
    Card,
    FormsModule,
    Toast,
    Select,
    MultiSelect,
    Button,
    PrimeTemplate,
  ],
  templateUrl: './rota-forms.html',
  styleUrl: '../../../template/templateForm.scss',
})

export class RotaForms implements OnInit {

  rota: Rota = {
    bairros: [],
    caminhaoId: 0,
    distanciaTotal: 0,
    ruas: [],
    tiposResiduos: []
  };

  rotaRequest: RotaRequestDTO = {
    caminhaoId: 0,
    origemId: 0,
    destinoId: 0,
    tipoResiduoId: []
  }

  formAtualizar: boolean = false;
  formDadosCarregados: boolean = false;

  caminhaoDisponivel: Caminhao[] = [];
  caminhaoSelecionado!: Caminhao;

  pontoColetaOrigem!: PontoColeta;
  pontoColetaDestino!: PontoColeta;

  pontosOrigemFiltrados: PontoColeta[] = [];
  pontosDestinoFiltrados: PontoColeta[] = [];

  residuosFiltrados: Residuo[] = [];
  residuosSelecionados: Residuo[] = [];

  pontoColetaMap = new Map<number, PontoColeta>();
  residuoMap = new Map<number, Residuo>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private rotaService: RotaService,
    private caminhaoService: CaminhaoService,
    private pontoColetaService: PontoColetaService,
    private residuoService: ResiduosService,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.caminhaoService.listar().subscribe(caminhoes => {
      this.caminhaoDisponivel = caminhoes;

      this.pontoColetaService.listar().subscribe(pontos => {
        pontos.forEach(p => this.pontoColetaMap.set(p.id!, p));

        this.residuoService.listar().subscribe(residuos => {
          residuos.forEach(r => this.residuoMap.set(r.id!, r));

          if (id) {
            this.formAtualizar = true;

            this.rotaService.buscar(id).subscribe(rota => {
              this.rota = rota;

              this.caminhaoSelecionado = this.caminhaoDisponivel
                .find(c => c.id === rota.caminhaoId)!;

              this.onSelecionarCaminhao();

              const origemId = rota.bairros[0];
              this.pontoColetaOrigem = this.pontosOrigemFiltrados
                .find(p => p.bairroId === origemId)!;

              this.onOrigemSelecionada();

              const destinoId = rota.bairros[rota.bairros.length - 1];
              this.pontoColetaDestino = this.pontosDestinoFiltrados
                .find(p => p.bairroId === destinoId)!;

              this.onDestinoSelecionado();

              this.residuosSelecionados =
                rota.tiposResiduos.map(id =>
                  this.residuoMap.get(id)!
                );
            });
          }

        });
      });
    });
  }

  onSelecionarCaminhao() {
    const tipos = this.caminhaoSelecionado.tiposResiduos;

    this.pontosOrigemFiltrados = Array.from(this.pontoColetaMap.values())
      .filter(p => p.tiposResiduos.some(t => tipos.includes(t)));

    if(!this.formDadosCarregados){
      this.pontoColetaOrigem = undefined!;
      this.pontoColetaDestino = undefined!;
      this.residuosSelecionados = [];
    }
  }


  onOrigemSelecionada() {
    this.pontosDestinoFiltrados = this.pontosOrigemFiltrados
      .filter(p => p.id !== this.pontoColetaOrigem.id);

    if(!this.formDadosCarregados){
      this.pontoColetaDestino = undefined!;
      this.residuosSelecionados = [];
    }
  }

  onDestinoSelecionado() {
    const permitidos = this.pontoColetaDestino.tiposResiduos; // array de IDs

    this.residuosFiltrados = Array.from(this.residuoMap.values())
      .filter(r => permitidos.includes(r.id!));

    if(!this.formDadosCarregados){
      this.residuosSelecionados = [];
    } else this.formDadosCarregados = true;
  }

  atualizar() {
    this.rotaRequest.caminhaoId = this.caminhaoSelecionado.id!;
    this.rotaRequest.origemId = this.pontoColetaOrigem.id!;
    this.rotaRequest.destinoId = this.pontoColetaDestino.id!;
    this.rotaRequest.tipoResiduoId = this.residuosSelecionados.map(r => r.id!);

    this.rotaService.atualizar(this.rota.id!, this.rotaRequest).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Rota atualizada com sucesso!'
        });

        setTimeout(() => {
          this.router.navigate(['/rota']);
        }, 1500);
      },
        error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err.error?.message || 'Erro ao atualizar rota'!
        });
      }
    });
  }

  protected cadastrar() {
    this.rotaRequest.caminhaoId = this.caminhaoSelecionado.id!;
    this.rotaRequest.origemId = this.pontoColetaOrigem.id!;
    this.rotaRequest.destinoId = this.pontoColetaDestino.id!;
    this.rotaRequest.tipoResiduoId = this.residuosSelecionados.map(r => r.id!);

    this.rotaService.adicionar(this.rotaRequest).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Rota cadastrada com sucesso!'
        });

        setTimeout(() => {
          this.router.navigate(['/rota']);
        }, 1500);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err.error?.message || 'Erro ao cadastrar rota'!
        });
      }
    });
  }

  voltar() {
    this.router.navigate(['/rota']);
  }
}
