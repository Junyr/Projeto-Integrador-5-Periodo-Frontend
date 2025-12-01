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
import {FormsModule} from '@angular/forms';
import {Bairro} from '../../../entity/Bairro';
import {BairroService} from '../../../service/bairro-service';
import {PontoColetaService} from '../../../service/ponto-coleta-service';
import {PontoColeta} from '../../../entity/PontoColeta';

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
    FormsModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {

  files: TreeNode[] = [];
  cols: any[] = [];

  caminhoesMap = new Map<number, Caminhao>();
  bairrosMap = new Map<number, Bairro>();
  ruasMap = new Map<number, Rua>();
  residuoMap = new Map<number, Residuo>();
  pontoColetaMap = new Map<number, PontoColeta>();

  constructor(
    private rotaService: RotaService,
    private ruaService: RuasService,
    private residuoService: ResiduosService,
    private caminhaoService: CaminhaoService,
    private bairroService: BairroService,
    private pontoColetaService: PontoColetaService) {}

  ngOnInit() {
    this.cols = [
      { field: 'nome', header: 'Descrição' },
      { field: 'valor', header: 'Valor' }
    ];

    this.carregarTree();
  }

  carregarTree() {
    this.caminhaoService.listar().subscribe(caminhao => {
      caminhao.forEach(c => this.caminhoesMap.set(c.id!, c));

      this.pontoColetaService.listar().subscribe(ponto => {
        ponto.forEach(p => {this.pontoColetaMap.set(p.id!, p)});

        this.bairroService.listar().subscribe(bairro => {
          bairro.forEach(b => this.bairrosMap.set(b.id!, b));

          this.ruaService.listar().subscribe(ruas => {
            ruas.forEach(r => {this.ruasMap.set(r.id!, r)});

            this.residuoService.listar().subscribe(residuo => {
              residuo.forEach(re => {this.residuoMap.set(re.id!, re)});

              this.rotaService.listar().subscribe((rotas) => {
                this.files = rotas.map(rota => ({
                  data: {
                    nome: `Rota #${rota.id}`,
                    valor: `Distância: ${rota.distanciaTotal} km`
                  },
                  children: [
                    {
                      data: {
                        nome: `${this.caminhoesMap.get(rota.caminhaoId)?.motorista}`,
                        valor: this.caminhoesMap.get(rota.caminhaoId)?.placa ?? '-'
                      }
                    },

                    {
                      data: {
                        nome: 'Ponto de Coleta',
                        valor: ''
                      },
                      children: [
                        {
                          data: {
                            nome: 'Origem',
                            valor:
                              Array.from(this.pontoColetaMap.values())
                                .find(p => p.bairroId === rota.bairros[0])
                                ?.nome ?? 'Sem ponto de coleta'
                          }
                        },
                        {
                          data: {
                            nome: 'Destino',
                            valor:
                              Array.from(this.pontoColetaMap.values())
                                .find(p => p.bairroId === rota.bairros[rota.bairros.length - 1])
                                ?.nome ?? 'Sem ponto de coleta'
                          }
                        }
                      ]
                    },

                    {
                      data: {
                        nome: 'Bairros',
                        valor: rota.bairros?.length ?? 0
                      },
                      children: rota.bairros?.map((idBairro: number) => ({
                        data: {
                          nome: '',
                          valor: this.bairrosMap.get(idBairro)?.nome,
                        }
                      }))
                    },
                    {
                      data: {
                        nome: 'Ruas',
                        valor: rota.ruas?.length ?? 0
                      },
                      children: rota.ruas?.map((idRua: number) => ({
                        data: {
                          nome: '',
                          valor: `${this.ruasMap.get(idRua)?.origem.nome}
                       → ${this.ruasMap.get(idRua)?.destino.nome}
                       (${this.ruasMap.get(idRua)?.distanciaKm} km)`
                        }
                      }))
                    },
                    {
                      data: {
                        nome: 'Tipos de Resíduos',
                        valor: rota.tiposResiduos?.length ?? 0
                      },
                      children: rota.tiposResiduos?.map((idResiduo: number) => ({
                        data: {
                          nome: '',
                          valor: `${this.residuoMap.get(idResiduo)?.tipo}`
                        }
                      }))
                    }
                  ]
                }));
              });
            })
          })
        })

      })
    })
  }

  deletar(id: number) {
    this.rotaService.deletar(id).subscribe(() => {
      this.carregarTree();
    });
  }

  protected atualizarRota(rowNode: any) {

  }
}
