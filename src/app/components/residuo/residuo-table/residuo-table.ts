import {Component, OnInit} from '@angular/core';
import {Button} from "primeng/button";
import {MenuItem, MessageService, PrimeTemplate} from "primeng/api";
import {TableModule} from "primeng/table";
import {Toast} from "primeng/toast";
import {Router} from '@angular/router';
import {Residuo} from '../../../entity/Residuo';
import {ResiduosService} from '../../../service/residuos-service';
import {Menubar} from 'primeng/menubar';
import {Ripple} from 'primeng/ripple';

@Component({
  selector: 'app-residuo-table',
  imports: [
    Button,
    PrimeTemplate,
    TableModule,
    Toast,
    Menubar,
    Ripple
  ],
  templateUrl: './residuo-table.html',
  styleUrl: '../../../template/templateTable.scss',
})
export class ResiduoTable implements OnInit {

  protected residuo: Residuo[] = [];
  protected menuItems: MenuItem[] = [];
  protected selectedNode: Residuo = {
    tipo: ""
  };

  constructor(
    private residuoService: ResiduosService,
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
    this.router.navigate(['residuo/adicionar']);
  }

  protected atualizar(id: number | undefined) {
    if(id !== undefined) {
      this.router.navigate([`residuo/atualizar/${id}`]);
    } else
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Residuo não encontrado!'
      });
  }

  protected deletar(id: number | undefined) {
    if(id !== undefined) {
      this.residuoService.deletar(id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Residuo deletado com sucesso!'
          });

          this.carregarTree();
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: err.error?.message || 'Erro ao deletar residuo!'
          });
        }
      });
    } else
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Residuo não encontrado!'
      });
  }

  protected carregarTree() {
    this.residuoService.listar().subscribe(residuo => {
      this.residuo = residuo;
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
