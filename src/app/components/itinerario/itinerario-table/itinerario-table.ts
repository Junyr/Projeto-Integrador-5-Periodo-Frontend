import {Component, OnInit} from '@angular/core';
import {Button} from 'primeng/button';
import {NgForOf, NgIf} from '@angular/common';
import {TreeTableModule} from 'primeng/treetable';
import {TreeNode} from 'primeng/api';
import {Caminhao} from '../../../entity/Caminhao';
import {Bairro} from '../../../entity/Bairro';
import {Rua} from '../../../entity/Rua';
import {Residuo} from '../../../entity/Residuo';
import {PontoColeta} from '../../../entity/PontoColeta';
import {RotaService} from '../../../service/rota-service';
import {RuasService} from '../../../service/ruas-service';
import {ResiduosService} from '../../../service/residuos-service';
import {CaminhaoService} from '../../../service/caminhao-service';
import {BairroService} from '../../../service/bairro-service';
import {PontoColetaService} from '../../../service/ponto-coleta-service';
import {Router} from '@angular/router';
import {ItinerarioService} from '../../../service/itinerario-service';
import {Rota} from '../../../entity/Rota';

@Component({
  selector: 'app-itinerario-table',
  imports: [
    Button,
    NgForOf,
    NgIf,
    TreeTableModule
  ],
  templateUrl: './itinerario-table.html',
  styleUrl: '../../../template/templateTable.scss',
})
export class ItinerarioTable implements OnInit {

  files: TreeNode[] = [];
  cols: any[] = [];

  caminhoesMap = new Map<number, Caminhao>();
  bairrosMap = new Map<number, Bairro>();
  ruasMap = new Map<number, Rua>();
  residuoMap = new Map<number, Residuo>();
  pontoColetaMap = new Map<number, PontoColeta>();
  rotaMap = new Map<number, Rota>();

  constructor(
    private itinerarioService: ItinerarioService,
    private rotaService: RotaService,
    private ruaService: RuasService,
    private residuoService: ResiduosService,
    private caminhaoService: CaminhaoService,
    private bairroService: BairroService,
    private pontoColetaService: PontoColetaService,
    private router: Router) {}

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
                rotas.forEach(r => {this.rotaMap.set(r.id!, r)});

                this.itinerarioService.listar().subscribe(itinerario => {
                  this.files = itinerario.map(itinerario => ({
                    data: {
                      id: itinerario.id,
                      nome: `Itinerario #${itinerario.id}`,
                      valor: `Data: ${this.formatarDataBR(itinerario.data)}`
                    },
                    children: [
                      {
                        data: {
                          nome: `Rota #${this.rotaMap.get(itinerario.rotaId)!.id}`,
                          valor: `Distância: ${this.rotaMap.get(itinerario.rotaId)!.distanciaTotal} km`
                        }, children: [
                          {
                            data: {
                              nome: `${this.caminhoesMap.get(this.rotaMap.get(itinerario.rotaId)!.caminhaoId)?.motorista}`,
                              valor: this.caminhoesMap.get(this.rotaMap.get(itinerario.rotaId)!.caminhaoId)?.placa ?? '-'
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
                                      .find(p => p.bairroId === this.rotaMap.get(itinerario.rotaId)!.bairros[0])
                                      ?.nome ?? 'Sem ponto de coleta'
                                }
                              },
                              {
                                data: {
                                  nome: 'Destino',
                                  valor:
                                    Array.from(this.pontoColetaMap.values())
                                      .find(p => p.bairroId === this.rotaMap.get(itinerario.rotaId)!.bairros[this.rotaMap.get(itinerario.rotaId)!.bairros.length - 1])
                                      ?.nome ?? 'Sem ponto de coleta'
                                }
                              }
                            ]
                          },

                          {
                            data: {
                              nome: 'Bairros',
                              valor: this.rotaMap.get(itinerario.rotaId)!.bairros?.length ?? 0
                            },
                            children: this.rotaMap.get(itinerario.rotaId)!.bairros?.map((idBairro: number) => ({
                              data: {
                                nome: '',
                                valor: this.bairrosMap.get(idBairro)?.nome,
                              }
                            }))
                          },
                          {
                            data: {
                              nome: 'Ruas',
                              valor: this.rotaMap.get(itinerario.rotaId)!.ruas?.length ?? 0
                            },
                            children: this.rotaMap.get(itinerario.rotaId)!.ruas?.map((idRua: number) => ({
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
                              valor: this.rotaMap.get(itinerario.rotaId)!.tiposResiduos?.length ?? 0
                            },
                            children: this.rotaMap.get(itinerario.rotaId)!.tiposResiduos?.map((idResiduo: number) => ({
                              data: {
                                nome: '',
                                valor: `${this.residuoMap.get(idResiduo)?.tipo}`
                              }
                            }))
                          }
                        ]
                      }
                    ]
                  }));
                })
              });
            })
          })
        })
      })
    })
  }

  deletar(id: number) {
    this.itinerarioService.deletar(id).subscribe(() => {
      this.carregarTree();
    });
  }

  protected adicionar() {
    this.router.navigate(['itinerario/adicionar']);
  }

  protected atualizar(id: number) {
    this.router.navigate([`/itinerario/atualizar/${id}`]);
  }

  protected formatarDataBR(data: Date | string): string {
    return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
  }
}
