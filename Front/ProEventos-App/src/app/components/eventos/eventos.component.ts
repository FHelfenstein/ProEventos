import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from '../../models/Evento';
import { EventoService } from '../../services/evento.service';

@Component({
  selector: 'app-eventos',
  templateUrl:'./eventos.component.html',
  styleUrls: ['./eventos.component.scss']
//providers:[EventoService]
})

export class EventosComponent implements OnInit {
  modalRef: BsModalRef;

  public eventos: Evento[] = [];
  public eventosFiltrados: Evento[] = [];

  public larguraImagem: number = 150;
  public margemImagem: number = 2;
  public exibirImagem: boolean = true;
  private filtroListado: string;

  public get filtroLista():string {
    return this.filtroListado;
  }

  public set filtroLista(value: string) {
    this.filtroListado = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }

  public filtrarEventos(filtrarPor: string) : Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      (evento: any) => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
                       evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1);
  }

  constructor(
              private eventoService: EventoService,
              private modalService: BsModalService,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService
              ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.getEventos();
  }

  public alterarImagem(): void {
    this.exibirImagem = !this.exibirImagem;
  }

  public getEventos(): void {
    const observer = {
      next:(_eventos: Evento[]) => {
        this.eventos = _eventos;
        this.eventosFiltrados = this.eventos;
      },
      error:() => {
        this.spinner.hide();
        this.toastr.error('Erro ao carregar os eventos', 'Erro!');

      },
      complete:() => this.spinner.hide()
    }

    this.eventoService.getEventos().subscribe(observer);
//      (_eventos: Evento[]) => {
//        this.eventos = _eventos;
//        this.eventosFiltrados = this.eventos;
//      },
//      error => console.log(error)
//    );
  }

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  confirm(): void {
    this.toastr.success('O Evento foi deletado com Sucesso', 'Deletado!');
    this.modalRef?.hide();
  }

  decline(): void {
    this.toastr.warning('O Evento não foi deletado com Sucesso', 'Não Deletado!');
    this.modalRef?.hide();
  }

}
