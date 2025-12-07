import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {BairroService} from '../../../service/bairro-service';
import {TableModule} from 'primeng/table';
import {Button} from 'primeng/button';
import {Bairro} from '../../../entity/Bairro';
import {Toast} from 'primeng/toast';
import {Menubar} from 'primeng/menubar';
import {Ripple} from 'primeng/ripple';
import {MenuItem, MessageService, TreeNode} from 'primeng/api';
import {TreeTableModule} from 'primeng/treetable';

@Component({
  selector: 'app-bairro-table',
  imports: [
    TableModule,
    Button,
    Toast,
    Menubar,
    Ripple,
    TreeTableModule
  ],
  templateUrl: './bairro-table.html',
  styleUrl: '../../../template/templateTable.scss',
})
export class BairroTable implements OnInit {

  protected bairro: Bairro[] = [];
  protected menuItems: MenuItem[] = [];
  protected selectedNode: Bairro = {
    nome: ''
  };

  constructor(
    private bairroService: BairroService,
    private router: Router,
    private messageService: MessageService) {}

  ngOnInit() {
    this.menuItems = [
      {
        label: 'Novo',
        command: () => this.adicionar()
      },
      {
        label: 'Editar',
        command: () => this.atualizar(this.selectedNode.id),
        disabled: true
      },
      {
        label: 'Excluir',
        command: () => this.deletar(this.selectedNode.id),
        disabled: true
      }
    ];

    this.carregarTree();
  }

  protected adicionar() {
    this.router.navigate(['bairro/adicionar']);
  }

  protected atualizar(id: number | undefined) {
    if(id !== undefined) {
      this.router.navigate([`bairro/atualizar/${id}`]);
    } else
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Bairro não encontrado!'
      });
  }

  protected deletar(id: number | undefined) {
    if(id !== undefined) {
      this.bairroService.deletar(id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Bairro deletado com sucesso!'
          });

          this.carregarTree();
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: err.error?.message || 'Erro ao deletar bairro!'
          });
        }
      });
    } else
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Bairro não encontrado!'
      });
  }

  protected carregarTree() {
    this.bairroService.listar().subscribe(bairro => {
      this.bairro = bairro;
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
