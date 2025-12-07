import {Component, OnInit} from '@angular/core';
import {Button} from 'primeng/button';
import {MenuItem, MessageService, PrimeTemplate} from 'primeng/api';
import {TableModule} from 'primeng/table';
import {Toast} from 'primeng/toast';
import {Router} from '@angular/router';
import {Rua} from '../../../entity/Rua';
import {RuasService} from '../../../service/ruas-service';
import {Menubar} from 'primeng/menubar';
import {Ripple} from 'primeng/ripple';

@Component({
  selector: 'app-rua-table',
  imports: [
    Button,
    PrimeTemplate,
    TableModule,
    Toast,
    Menubar,
    Ripple
  ],
  templateUrl: './rua-table.html',
  styleUrl: '../../../template/templateTable.scss',
})
export class RuaTable implements OnInit {

  protected rua: Rua[] = [];
  protected menuItems: MenuItem[] = [];
  protected selectedNode: Rua = {
    origem: {
      nome: ''
    },
    destino: {
      nome: ''
    },
    distanciaKm: 0
  };

  constructor(
    private ruaService: RuasService,
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
    this.router.navigate(['rua/adicionar']);
  }

  protected atualizar(id: number | undefined) {
    if(id !== undefined) {
      this.router.navigate([`rua/atualizar/${id}`]);
    } else
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Rua não encontrada!'
      });
  }

  protected deletar(id: number | undefined) {
    if(id !== undefined) {
      this.ruaService.deletar(id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Rua deletada com sucesso!'
          });

          this.carregarTree();
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: err.error?.message || 'Erro ao deletar rua!'
          });
        }
      });
    } else
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Rua não encontrada!'
      });
  }

  protected carregarTree() {
    this.ruaService.listar().subscribe(rua => {
      this.rua = rua;
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
