import {Component, OnInit} from '@angular/core';
import {Button} from 'primeng/button';
import {NgForOf, NgIf} from '@angular/common';
import {TreeTableModule} from 'primeng/treetable';
import {MenuItem, MessageService, TreeNode} from 'primeng/api';
import {Router} from '@angular/router';
import {ResiduosService} from '../../../service/residuos-service';
import {CaminhaoService} from '../../../service/caminhao-service';
import {Residuo} from '../../../entity/Residuo';
import {Toast} from 'primeng/toast';
import {Menubar} from 'primeng/menubar';
import {Ripple} from 'primeng/ripple';

@Component({
  selector: 'app-caminhao-table',
  imports: [
    Button,
    NgForOf,
    NgIf,
    TreeTableModule,
    Toast,
    Menubar,
    Ripple
  ],
  templateUrl: './caminhao-table.html',
  styleUrl: '../../../template/templateTable.scss',
})
export class CaminhaoTable implements OnInit {

  protected files: TreeNode[] = [];
  protected cols: any[] = [];

  protected menuItems: MenuItem[] = [];
  protected selectedNode!: TreeNode;

  protected residuoMap = new Map<number, Residuo>();

  constructor(
    private residuoService: ResiduosService,
    private caminhaoService: CaminhaoService,
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
    this.router.navigate(['caminhao/adicionar']);
  }

  protected atualizar(id: number) {
    this.router.navigate([`caminhao/atualizar/${id}`]);
  }

  protected deletar(id: number) {
    this.caminhaoService.deletar(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Caminhão deletado com sucesso!'
        });

        this.carregarTree();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err.error?.message || 'Erro ao deletar caminhão!'
        });
      }
    });
  }

  protected carregarTree() {
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
