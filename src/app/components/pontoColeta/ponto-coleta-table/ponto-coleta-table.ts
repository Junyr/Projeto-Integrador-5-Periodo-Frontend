import {Component, OnInit} from '@angular/core';
import {Button} from 'primeng/button';
import {NgForOf, NgIf} from '@angular/common';
import {TreeTableModule} from 'primeng/treetable';
import {TreeNode} from 'primeng/api';
import {Bairro} from '../../../entity/Bairro';
import {Residuo} from '../../../entity/Residuo';
import {ResiduosService} from '../../../service/residuos-service';
import {BairroService} from '../../../service/bairro-service';
import {PontoColetaService} from '../../../service/ponto-coleta-service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-ponto-coleta-table',
  imports: [
    Button,
    NgForOf,
    NgIf,
    TreeTableModule
  ],
  templateUrl: './ponto-coleta-table.html',
  styleUrl: '../../../template/templateTable.scss',
})
export class PontoColetaTable implements OnInit {

  files: TreeNode[] = [];
  cols: any[] = [];

  bairrosMap = new Map<number, Bairro>();
  residuoMap = new Map<number, Residuo>();

  constructor(
    private residuoService: ResiduosService,
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
    this.bairroService.listar().subscribe(bairro => {
      bairro.forEach(b => this.bairrosMap.set(b.id!, b));

        this.residuoService.listar().subscribe(residuo => {
          residuo.forEach(re => {this.residuoMap.set(re.id!, re)});

          this.pontoColetaService.listar().subscribe(ponto => {
            this.files = ponto.map(ponto => ({
              data: {
                id: ponto.id,
                nome: `${ponto.nome}`,
                valor: `Responsavel: ${ponto.responsavel}`
              },
              children: [
                {
                  data: {
                    nome: 'Telefone do Responsavel',
                    valor: ponto.telefoneResponsavel ?? '-'
                  }
                },

                {
                  data: {
                    nome: 'Email do responsavel',
                    valor: ponto.emailResponsavel ?? '-'
                  }
                },

                {
                  data: {
                    nome: 'Endereço',
                    valor: ponto.endereco ?? '-'
                  }
                },

                {
                  data: {
                    nome: 'Horario',
                    valor: ponto.horario ?? '-'
                  }
                },

                {
                  data: {
                    nome: 'Bairro',
                    valor: this.bairrosMap.get(ponto.bairroId)?.nome
                  }
                },

                {
                  data: {
                    nome: 'Tipos de Residuos',
                    valor: ponto.tiposResiduos.length
                  },
                  children: ponto.tiposResiduos.map((idResiduo: number) => ({
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
    })
  }

  deletar(id: number) {
    this.pontoColetaService.deletar(id).subscribe(() => {
      this.carregarTree();
    });
  }

  protected adicionar() {
    this.router.navigate(['pontoColeta/adicionar']);
  }

  protected atualizarPontoColeta(id: number) {
    this.router.navigate([`pontoColeta/atualizar/${id}`]);
  }
}
