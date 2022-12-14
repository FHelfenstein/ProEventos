import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from '@app/models/Evento';
import { EventoService } from '@app/services/evento.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.scss']
})
export class EventoListaComponent implements OnInit {

  modalRef: BsModalRef;

  public eventos: Evento[] = [];
  public eventosFiltrados: Evento[] = [];
  public eventoId = 0;

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
                private spinner: NgxSpinnerService,
                private router: Router
              ) { }

  ngOnInit(): void {
    this.spinner.show();
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
  }

  openModal(event:any,template: TemplateRef<any>,eventoId:number): void {
    //** esta função faz com que ao clicar na linha do botão delete da lista de eventos ele não propague abrindo a tela de evento-detalhe permanecendo na tela*/
    event.stopPropagation();
    this.eventoId = eventoId;
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
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
