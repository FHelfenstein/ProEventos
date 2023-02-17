import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from '@app/models/Evento';
import { EventoService } from '@app/services/evento.service';
import { environment } from '@environments/environment';
import { PaginatedResult, Pagination } from '@app/models/Pagination';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.scss']
})
export class EventoListaComponent implements OnInit {

  modalRef: BsModalRef;

  public eventos: Evento[] = [];
  public eventoId = 0;
  public pagination = {} as Pagination;

  public larguraImagem: number = 150;
  public margemImagem: number = 2;
  public exibirImagem: boolean = true;

  termoBuscaChanged:Subject<string> = new Subject<string>();

  public filtrarEventos(evt: any) : void {
    if (this.termoBuscaChanged.observers.length == 0) {
      this.termoBuscaChanged
        .pipe(debounceTime(1000))
        .subscribe((filtrarPor) => {
          this.spinner.show();

          this.eventoService
              .getEventos(
                this.pagination.currentPage,
                this.pagination.itemsPerPage,
                filtrarPor
              ).subscribe(
                (paginatedResult: PaginatedResult<Evento[]>) => {
                  this.eventos = paginatedResult.result;
                  this.pagination = paginatedResult.pagination;
                },
                (error: any) => {
                  this.spinner.hide();
                  this.toastr.error('Erro ao Carregar Eventos.','Erro!');
                  console.log(error.errors);
                }

              ).add( () => this.spinner.hide() );
        });
    }
    this.termoBuscaChanged.next(evt.value);
  }

  constructor(
                private eventoService: EventoService,
                private modalService: BsModalService,
                private toastr: ToastrService,
                private spinner: NgxSpinnerService,
                private router: Router
              ) { }

  ngOnInit(): void {
    this.pagination = {
      currentPage: 1,
      itemsPerPage: 3,
      totalPages: 1
    } as Pagination;

    this.carregarEventos();
  }

  public alterarImagem(): void {
    this.exibirImagem = !this.exibirImagem;
  }

  mostraImagem(imagemURL: string): string {
    return (imagemURL !== '')
        ? `${environment.apiURL}resources/images/${imagemURL}`
        : 'assets/img/semImagem.jpeg';

  }

  public carregarEventos(): void {
    this.spinner.show();

    this.eventoService
      .getEventos(this.pagination.currentPage, this.pagination.itemsPerPage)
      .subscribe(
        (paginatedResult: PaginatedResult<Evento[]>) => {
          this.eventos = paginatedResult.result;
          this.pagination = paginatedResult.pagination;
        },
        (error: any) => {
          this.spinner.hide();
          this.toastr.error('Erro ao Carregar Eventos.','Erro!');
        }

      ).add( () => this.spinner.hide() );
  }

  openModal(event:any,template: TemplateRef<any>,eventoId:number): void {
    //** esta função faz com que ao clicar na linha do botão delete da lista de eventos ele não propague abrindo a tela de evento-detalhe permanecendo na tela*/
    event.stopPropagation();
    this.eventoId = eventoId;
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  public pageChanged(event): void {
    this.pagination.currentPage = event.page;
    this.carregarEventos();
  }

  confirm(): void {
    this.modalRef.hide();
    this.spinner.show();

    this.eventoService.deleteEvento(this.eventoId).subscribe(
      (result: any) => {
        if(result.message == 'Deletado.'){
          console.log(result);
          this.toastr.success('O Evento foi deletado com Sucesso', 'Deletado!');
          this.carregarEventos();
        }
      },
      (error:any) => {
        this.toastr.error(`Erro ao tentar deletar o evento ${this.eventoId}`,'Erro!');
        console.error(error);
      }
    ).add(() => this.spinner.hide());
  }

  decline(): void {
      this.modalRef.hide();
  }

  detalheEvento(id:number): void {
    this.router.navigate([`eventos/detalhe/${id}`]);
  }

}
