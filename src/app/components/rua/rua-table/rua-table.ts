import {Component, OnInit} from '@angular/core';
import {Button} from 'primeng/button';
import {PrimeTemplate} from 'primeng/api';
import {TableModule} from 'primeng/table';
import {Toast} from 'primeng/toast';
import {Router} from '@angular/router';
import {Rua} from '../../../entity/Rua';
import {RuasService} from '../../../service/ruas-service';

@Component({
  selector: 'app-rua-table',
  imports: [
    Button,
    PrimeTemplate,
    TableModule,
    Toast
  ],
  templateUrl: './rua-table.html',
  styleUrl: '../../../template/templateTable.scss',
})
export class RuaTable implements OnInit {

  rua: Rua[] = [];

  constructor(
    private ruaService: RuasService,
    private router: Router) {}

  ngOnInit() {
    this.carregarTree();
  }

  carregarTree() {
    this.ruaService.listar().subscribe(rua => {
      this.rua = rua;
    })
  }

  deletar(id: number) {
    this.ruaService.deletar(id).subscribe(() => {
      this.carregarTree();
    });
  }

  protected adicionar() {
    this.router.navigate(['rua/adicionar']);
  }

  protected atualizar(id: number) {
    this.router.navigate([`rua/atualizar/${id}`]);
  }

}
