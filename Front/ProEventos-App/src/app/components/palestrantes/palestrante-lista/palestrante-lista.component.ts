import { Component, OnInit } from '@angular/core';
import { PalestranteService } from '@app/services/palestrante.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Palestrante } from '@app/models/Palestrante';
import { PaginatedResult, Pagination } from '@app/models/Pagination';
import { environment } from '@environments/environment';
import { EventoService } from '@app/services/evento.service';
import { Evento } from '@app/models/Evento';

@Component({
  selector: 'app-palestrante-lista',
  templateUrl: './palestrante-lista.component.html',
  styleUrls: ['./palestrante-lista.component.scss']
})
export class PalestranteListaComponent implements OnInit {
  public Palestrantes: Palestrante[] = [];
  public pagination = {} as Pagination;
  public eventosCriados = 0;

  constructor(private palestranteService: PalestranteService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private eventoService: EventoService,
    private router: Router) { }

  public ngOnInit() {
    this.pagination = {
      currentPage: 1,
      itemsPerPage: 3,
      totalPages: 1
    } as Pagination;

    this.carregarPalestrantes();
    this.getEventosCriados();
  }
  public getEventosCriados(): void {
    this.spinner.show();

    this.eventoService
      .getEventos(
        this.pagination.currentPage,
        this.pagination.itemsPerPage)
      .subscribe(
          (paginatedResult: PaginatedResult<Evento[]>) => {
            this.eventosCriados = paginatedResult.pagination.totalItems;
          },
          () => {
            this.toastr.error('Erro ao Carregar Meus Eventos Criados.','Erro!');
          }
      ).add( () => this.spinner.hide() );
  }

  termoBuscaChanged:Subject<string> = new Subject<string>();

  public filtrarPalestrantes(evt: any) : void {
    if (this.termoBuscaChanged.observers.length == 0) {
      this.termoBuscaChanged
        .pipe(debounceTime(1000))
        .subscribe((filtrarPor) => {
          this.spinner.show();

          this.palestranteService
              .getPalestrantes(
                this.pagination.currentPage,
                this.pagination.itemsPerPage,
                filtrarPor
              ).subscribe(
                (paginatedResult: PaginatedResult<Palestrante[]>) => {
                  this.Palestrantes = paginatedResult.result;
                  this.pagination = paginatedResult.pagination;
                },
                (error: any) => {
                  this.spinner.hide();
                  this.toastr.error('Erro ao Carregar Palestrantes.','Erro!');
                  console.log(error.errors);
                }

              ).add( () => this.spinner.hide() );
        });
    }
    this.termoBuscaChanged.next(evt.value);
  }

  public carregarPalestrantes(): void {
    this.spinner.show();

    this.palestranteService
      .getPalestrantes(this.pagination.currentPage, this.pagination.itemsPerPage)
      .subscribe(
        (paginatedResult: PaginatedResult<Palestrante[]>) => {
          this.Palestrantes = paginatedResult.result;
          this.pagination = paginatedResult.pagination;
        },
        (error: any) => {
          this.spinner.hide();
          this.toastr.error('Erro ao Carregar Palestrantes.','Erro!');
          console.error(error);
        }
      ).add( () => this.spinner.hide() );
  }

  public getImagemURL(imagemName: string) : string {

    if(imagemName)
      return environment.apiURL + `resources/perfil/${imagemName}`;
    else
      return './assets/img/perfil.png';
  }
}
