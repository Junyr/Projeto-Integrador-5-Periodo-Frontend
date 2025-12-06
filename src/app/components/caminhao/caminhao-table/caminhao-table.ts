import { Component } from '@angular/core';
import {Button} from 'primeng/button';
import {NgForOf, NgIf} from '@angular/common';
import {TreeTableModule} from 'primeng/treetable';
import {TreeNode} from 'primeng/api';
import {Router} from '@angular/router';
import {ResiduosService} from '../../../service/residuos-service';
import {CaminhaoService} from '../../../service/caminhao-service';
import {Residuo} from '../../../entity/Residuo';

@Component({
  selector: 'app-caminhao-table',
  imports: [
    Button,
    NgForOf,
    NgIf,
    TreeTableModule
  ],
  templateUrl: './caminhao-table.html',
  styleUrl: '../../../template/templateTable.scss',
})
export class CaminhaoTable {

  files: TreeNode[] = [];
  cols: any[] = [];

  residuoMap = new Map<number, Residuo>();

  constructor(
    private residuoService: ResiduosService,
    private caminhaoService: CaminhaoService,
    private router: Router) {}

  ngOnInit() {
    this.cols = [
      { field: 'nome', header: 'Descrição' },
      { field: 'valor', header: 'Valor' }
    ];

    this.carregarTree();
  }

  carregarTree() {
    this.residuoService.listar().subscribe(residuo => {
      residuo.forEach(re => {this.residuoMap.set(re.id!, re)});

      this.caminhaoService.listar().subscribe(caminhao => {
        this.files = caminhao.map(caminhao => ({
          data: {
            id: caminhao.id,
            nome: `${caminhao.placa}`,
            valor: `Motorista: ${caminhao.motorista}`
          },
          children: [
            {
              data: {
                nome: 'Capacidade',
                valor: `${caminhao.capacidade ?? 0}t`
              }
            },

            {
              data: {
                nome: 'Tipos de Residuos',
                valor: caminhao.tiposResiduos.length
              },
              children: caminhao.tiposResiduos.map((idResiduo: number) => ({
                data: {
                  nome: '',
                  valor: this.residuoMap.get(idResiduo)?.tipo,
                }
              }))
            },
          ]
        }));
      })
    })
  }

  deletar(id: number) {
    this.caminhaoService.deletar(id).subscribe(() => {
      this.carregarTree();
    });
  }

  protected adicionar() {
    this.router.navigate(['caminhao/adicionar']);
  }

  protected atualizar(id: number) {
    this.router.navigate([`caminhao/atualizar/${id}`]);
  }
}
