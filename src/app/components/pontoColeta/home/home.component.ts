import {Component, OnInit} from '@angular/core';
import {TreeTableModule} from 'primeng/treetable';
import {TreeNode} from 'primeng/api';
import {RotaService} from '../../../service/rota-service';
import {CommonModule, NgForOf, NgIf} from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { PickListModule } from 'primeng/picklist';
import {RuasService} from '../../../service/ruas-service';
import {Rua} from '../../../entity/Rua';
import {ResiduosService} from '../../../service/residuos-service';
import {Residuo} from '../../../entity/Residuo';
import {Caminhao} from '../../../entity/Caminhao';
import {CaminhaoService} from '../../../service/caminhao-service';
import {Select} from 'primeng/select';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    NgForOf,
    NgIf,
    TreeTableModule,
    ButtonModule,
    DialogModule,
    PickListModule,
    Select,
    FormsModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {

  files: TreeNode[] = [];
  cols: any[] = [];
  modalEditar = false;
  rotaSelecionada: any;

  caminhaoDisponiveis: Caminhao[] = [];
  caminhaoSelecionada: Caminhao = {
    placa: '',
    motorista: '',
    capacidade: 0,
    tiposResiduos: []
  };

  ruasDisponiveis: Rua[] = [];
  ruasSelecionadas: Rua[] = [];

  residuosDisponiveis: Residuo[] = [];
  residuosSelecionados: Residuo[] = [];

  constructor(
    private rotaService: RotaService,
    private ruaService: RuasService,
    private residuoService: ResiduosService,
    private caminhaoService: CaminhaoService) {}

  ngOnInit() {
    this.cols = [
      { field: 'nome', header: 'Descrição' },
      { field: 'valor', header: 'Valor' }
    ];

    this.carregarTree();
  }

  carregarTree() {
    this.rotaService.listar().subscribe((rotas) => {
      this.files = rotas.map(rota => ({
        data: {
          id: rota.id,
          caminhaoId: rota.caminhaoId,
          bairros: rota.bairros,
          ruas: rota.ruas,
          tiposResiduos: rota.tiposResiduos,
          nome: `Rota #${rota.id}`,
          valor: `Distância: ${rota.distanciaTotal} km`
        },
        children: [
          { data: { nome: 'Caminhão', valor: rota.caminhaoId } },
          { data: { nome: 'Bairros', valor: rota.bairros.join(', ') } },
          { data: { nome: 'Ruas', valor: rota.ruas.join(', ') } },
          { data: { nome: 'Tipos de Resíduos', valor: rota.tiposResiduos.join(', ') } }
        ]
      }));
    });
  }

  abrirEdicao(node: any) {

    this.rotaSelecionada = node.data;
    this.modalEditar = true;

    this.caminhaoService.listar().subscribe((caminhao) => {
      this.caminhaoDisponiveis = caminhao;

      this.caminhaoSelecionada = this.caminhaoDisponiveis.find(
        c => c.id === this.rotaSelecionada.caminhaoId
      )!;
    });

    this.ruaService.listar().subscribe((ruas: Rua[]) => {
      this.ruasDisponiveis = ruas;

      this.ruasSelecionadas = ruas.filter(rua =>
        this.rotaSelecionada?.ruas?.includes(rua.id)
      );
    });

    this.residuoService.listar().subscribe((residuos: Residuo[]) => {
      this.residuosDisponiveis = residuos;

      this.residuosSelecionados = residuos.filter(res =>
        this.rotaSelecionada?.tiposResiduos?.includes(res.id)
      );
    });
  }

  deletar(id: number) {
    this.rotaService.deletar(id).subscribe(() => {
      this.carregarTree();
    });
  }


  protected salvarEdicao() {

  }
}
