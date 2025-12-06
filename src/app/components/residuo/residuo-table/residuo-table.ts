import {Component, OnInit} from '@angular/core';
import {Button} from "primeng/button";
import {PrimeTemplate} from "primeng/api";
import {TableModule} from "primeng/table";
import {Toast} from "primeng/toast";
import {Router} from '@angular/router';
import {Residuo} from '../../../entity/Residuo';
import {ResiduosService} from '../../../service/residuos-service';

@Component({
  selector: 'app-residuo-table',
    imports: [
        Button,
        PrimeTemplate,
        TableModule,
        Toast
    ],
  templateUrl: './residuo-table.html',
  styleUrl: '../../../template/templateTable.scss',
})
export class ResiduoTable implements OnInit {

  residuo: Residuo[] = [];

  constructor(
    private residuoService: ResiduosService,
    private router: Router) {}

  ngOnInit() {
    this.carregarTree();
  }

  carregarTree() {
    this.residuoService.listar().subscribe(residuo => {
      this.residuo = residuo;
    })
  }

  deletar(id: number) {
    this.residuoService.deletar(id).subscribe(() => {
      this.carregarTree();
    });
  }

  protected adicionar() {
    this.router.navigate(['residuo/adicionar']);
  }

  protected atualizar(id: number) {
    this.router.navigate([`residuo/atualizar/${id}`]);
  }
}
