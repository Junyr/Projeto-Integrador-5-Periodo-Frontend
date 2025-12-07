import {Component, OnInit} from '@angular/core';
import {Button} from 'primeng/button';
import {Card} from 'primeng/card';
import {MessageService, PrimeTemplate} from 'primeng/api';
import {Select} from 'primeng/select';
import {Toast} from 'primeng/toast';
import {Rota} from '../../../entity/Rota';
import {ActivatedRoute, Router} from '@angular/router';
import {RotaService} from '../../../service/rota-service';
import {Itinerario} from '../../../entity/Itinerario';
import {ItinerarioService} from '../../../service/itinerario-service';
import {FormsModule} from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';


@Component({
  selector: 'app-itinerario-form',
  imports: [
    Button,
    Card,
    PrimeTemplate,
    Select,
    Toast,
    FormsModule,
    DatePickerModule
  ],
  templateUrl: './itinerario-form.html',
  styleUrl: '../../../template/templateForm.scss',
})
export class ItinerarioForm implements OnInit {

  itinerario: Itinerario = {
    rotaId: 0,
    data: new Date()
  };

  rotaDisponivel: Rota[] = [];
  rotaSelecionado!: Rota;

  dataSelecionada: Date = new Date();
  hoje: Date = new Date();
  dataBloqueadas: Date[] = [];

  formAtualizar: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private rotaService: RotaService,
    private itinerarioService: ItinerarioService,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if(id != null){
      this.itinerarioService.buscar(id).subscribe(itinerario => {
        this.itinerario = itinerario;
        this.dataSelecionada = new Date(itinerario.data + 'T00:00:00');

        this.rotaService.buscar(itinerario.rotaId!).subscribe(rota => {
          this.rotaSelecionado = rota;
        })

        this.formAtualizar = true;
      })
    }

    this.rotaService.listar().subscribe(rota => {
      this.rotaDisponivel = rota.map(r => ({
        ...r,
        label: `Rota #${r.id}`
      }));
    })
  }

  protected onSelecionarRota() {
    this.dataBloqueadas = [];

    this.itinerarioService.listar().subscribe(itinerarios => {
      itinerarios.forEach(it => {
        this.dataBloqueadas.push(new Date(it.data + 'T00:00:00'));
      });
    });
  }


  protected cadastrar() {
    this.itinerario.rotaId = this.rotaSelecionado.id!;
    this.itinerario.data = this.dataSelecionada;

    this.itinerarioService.adicionar(this.itinerario).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Itinerario cadastrada com sucesso!'
        });

        setTimeout(() => {
          this.router.navigate(['/itinerario']);
        }, 1500);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err.error?.message || 'Erro ao cadastrar itinerario'!
        });
      }
    });
  }

  atualizar() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    console.log(this.rotaSelecionado);
    this.itinerario.rotaId = this.rotaSelecionado.id!;
    this.itinerario.data = this.dataSelecionada;
    console.log(this.itinerario);

    this.itinerarioService.atualizar(id, this.itinerario).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Itinerario atualizada com sucesso!'
        });

        setTimeout(() => {
          this.router.navigate(['/itinerario']);
        }, 1500);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err.error?.message || 'Erro ao atualizar itinerario'!
        });
      }
    });
  }

  voltar() {
    this.router.navigate(['/itinerario']);
  }
}
