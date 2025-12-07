import {Component, OnInit} from '@angular/core';
import {Button} from 'primeng/button';
import {NgForOf, NgIf} from '@angular/common';
import {TreeTableModule} from 'primeng/treetable';
import {MenuItem, TreeNode} from 'primeng/api';
import {MessageService} from 'primeng/api';
import {Bairro} from '../../../entity/Bairro';
import {Residuo} from '../../../entity/Residuo';
import {ResiduosService} from '../../../service/residuos-service';
import {BairroService} from '../../../service/bairro-service';
import {PontoColetaService} from '../../../service/ponto-coleta-service';
import {Router} from '@angular/router';
import {Menubar} from 'primeng/menubar';
import {Ripple} from 'primeng/ripple';
import {Toast} from 'primeng/toast';

@Component({
  selector: 'app-ponto-coleta-table',
  imports: [
    Button,
    NgForOf,
    NgIf,
    TreeTableModule,
    Menubar,
    Ripple,
    Toast
  ],
  templateUrl: './ponto-coleta-table.html',
  styleUrl: '../../../template/templateTable.scss',
})
export class PontoColetaTable implements OnInit {

  protected files: TreeNode[] = [];
  protected cols: any[] = [];

  protected menuItems: MenuItem[] = [];
  protected selectedNode!: TreeNode;

  protected bairrosMap = new Map<number, Bairro>();
  protected residuoMap = new Map<number, Residuo>();

  constructor(
    private residuoService: ResiduosService,
    private bairroService: BairroService,
    private pontoColetaService: PontoColetaService,
    private router: Router,
    private messageService: MessageService) {}

  ngOnInit() {
    this.cols = [
      { field: 'nome', header: 'Descrição' },
      { field: 'valor', header: 'Valor' }
    ];

    this.menuItems = [
      {
        label: 'Novo',
        command: () => this.adicionar()
      },
      {

        label: 'Editar',
        command: () => this.atualizar(this.selectedNode.data.id),
        disabled: true
      },
      {
        label: 'Excluir',
        command: () => this.deletar(this.selectedNode.data.id),
        disabled: true
      }
    ];

    this.carregarTree();
  }

  protected adicionar() {
    this.router.navigate(['pontoColeta/adicionar']);
  }

  protected atualizar(id: number) {
    this.router.navigate([`pontoColeta/atualizar/${id}`]);
  }

  protected deletar(id: number) {
    this.pontoColetaService.deletar(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Ponto de coleta deletado com sucesso!'
        });

        this.carregarTree();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err.error?.message || 'Erro ao deletar ponto de coleta!'
        });
      }
    });
  }

  protected carregarTree() {
    this.bairroService.listar().subscribe(bairro => {
      bairro.forEach(b => this.bairrosMap.set(b.id!, b));

      this.residuoService.listar().subscribe(residuo => {
        residuo.forEach(re => {this.residuoMap.set(re.id!, re)});

        this.pontoColetaService.listar().subscribe(ponto => {
          this.files = ponto.map(ponto => ({
            id: ponto.id,
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

  onSelectionChange() {
    if(this.selectedNode == null) {
      this.menuItems[1].disabled = true;
      this.menuItems[2].disabled = true;
    } else {
      this.menuItems[1].disabled = false;
      this.menuItems[2].disabled = false;
    }
  }
}
