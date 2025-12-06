import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {BairroService} from '../../../service/bairro-service';
import {TableModule} from 'primeng/table';
import {Button} from 'primeng/button';
import {Bairro} from '../../../entity/Bairro';
import {Toast} from 'primeng/toast';

@Component({
  selector: 'app-bairro-table',
  imports: [
    TableModule,
    Button,
    Toast
  ],
  templateUrl: './bairro-table.html',
  styleUrl: '../../../template/templateTable.scss',
})
export class BairroTable implements OnInit {

  bairro: Bairro[] = [];

  constructor(
    private bairroService: BairroService,
    private router: Router) {}

  ngOnInit() {
    this.carregarTree();
  }

  carregarTree() {
    this.bairroService.listar().subscribe(bairro => {
      this.bairro = bairro;
    })
  }

  deletar(id: number) {
    this.bairroService.deletar(id).subscribe(() => {
      this.carregarTree();
    });
  }

  protected adicionar() {
    this.router.navigate(['bairro/adicionar']);
  }

  protected atualizar(id: number) {
    this.router.navigate([`bairro/atualizar/${id}`]);
  }
}
