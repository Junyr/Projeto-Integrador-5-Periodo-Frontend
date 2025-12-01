import {Component, OnInit} from '@angular/core';
import {Button} from "primeng/button";
import {Card} from "primeng/card";
import {FormBuilder, FormGroup, FormsModule} from "@angular/forms";
import {InputText} from "primeng/inputtext";
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

@Component({
  selector: 'app-rota-atualizar-formulario.component',
  imports: [
    Button,
    Card,
    FormsModule,
    Toast,
    Select
  ],
  templateUrl: './rota-atualizar-formulario.component.html',
  styleUrl: '../../../template/templateForm.scss',
})

export class RotaAtualizarFormularioComponent implements OnInit {

  rota: Rota = {
    bairros: [],
    caminhaoId: 0,
    distanciaTotal: 0,
    ruas: [],
    tiposResiduos: []
  };

  caminhaoDisponivel: Caminhao[] = [];
  caminhaoSelecionado!: Caminhao;

  pontoColetaOrigem!: PontoColeta;
  pontoColetaDestino!: PontoColeta;

  pontosOrigemFiltrados: PontoColeta[] = [];
  pontosDestinoFiltrados: PontoColeta[] = [];

  residuosMapArray: Residuo[] = [];
  residuosFiltrados: Residuo[] = [];
  residuosSelecionados: Residuo[] = [];

  pontoColetaMap = new Map<number, PontoColeta>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private rotaService: RotaService,
    private caminhaoService: CaminhaoService,
    private pontoColetaService: PontoColetaService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.caminhaoService.listar().subscribe(caminhoes => {
      this.caminhaoDisponivel = caminhoes;
    });

    this.pontoColetaService.listar().subscribe(pontos => {
      pontos.forEach(p => this.pontoColetaMap.set(p.id!, p));
    });

    this.rotaService.buscar(id).subscribe(rota => {
      this.rota = rota;
    });
  }

  /*
  onSelecionarCaminhao() {
    const tipos = this.caminhaoSelecionado.tiposResiduos;

    this.pontosOrigemFiltrados = Array.from(this.pontoColetaMap.values())
      .filter(p => p.tiposResiduos.some(t => tipos.includes(t)));

    this.pontoColetaOrigem = undefined!;
    this.pontoColetaDestino = undefined!;
    this.residuosSelecionados = [];
  }
  */

  onOrigemSelecionada() {
    this.pontosDestinoFiltrados = this.pontosOrigemFiltrados
      .filter(p => p.id !== this.pontoColetaOrigem.id);

    this.pontoColetaDestino = undefined!;
    this.residuosSelecionados = [];
  }

  onDestinoSelecionado() {
    const permitidos = this.pontoColetaDestino.tiposResiduos;

    this.residuosFiltrados = this.residuosMapArray
      .filter(r => permitidos.includes(r));
  }

  atualizar() {
    this.rota.caminhaoId = this.caminhaoSelecionado.id!;
    this.rota.tiposResiduos = this.residuosSelecionados.map(r => r.id!);
    this.rota.bairros = [
      this.pontoColetaOrigem.bairroId,
      this.pontoColetaDestino.bairroId
    ];

    this.rotaService.atualizar(this.rota.id!, this.rota).subscribe(() => {
      this.router.navigate(['/home']);
    });
  }

  voltar() {
    this.router.navigate(['/home']);
  }

}
