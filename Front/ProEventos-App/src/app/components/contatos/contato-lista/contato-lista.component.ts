import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { Contato } from '@app/models/Contato';
import { ContatoService } from '@app/services/contato.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contato-lista',
  templateUrl: './contato-lista.component.html',
  styleUrls: ['./contato-lista.component.scss']
})
export class ContatoListaComponent implements OnInit {

  modalRef: BsModalRef;

  public contatos: Contato[] = [];
  public contatosFiltrados: Contato[] = [];
  public nome: string ;
  public contatoId = 0;
  private filtroListado: string;

  public get filtroLista():string {
    return this.filtroListado;
  }

  public set filtroLista(value: string) {
    this.filtroListado = value;
    this.contatosFiltrados = this.filtroLista ? this.filtrarContatos(this.filtroLista) : this.contatos;
  }

  public filtrarContatos(filtrarPor: string): Contato[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.contatos.filter(
      (_contato: Contato) => _contato.nome.toLocaleLowerCase().indexOf(filtrarPor) !== -1);
  }

  constructor(
              private contatoService: ContatoService,
              private modalService: BsModalService,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService,
              private router: Router) { }

  ngOnInit() {
    this.carregarContatos();
  }

  public carregarContatos() : void {
    this.spinner.show();

    this.contatoService.getContatos(this.nome)
      .subscribe(
          (contatosRetorno:Contato[]) => {
            this.contatos = contatosRetorno;
            this.contatosFiltrados = this.contatos;
          },
          (error: any) => {
            console.error(error);
            this.toastr.error("Erro ao carregar Contatos.","Erro!");
          }

      ).add( () => this.spinner.hide() );

  }

  openModal(event:any,template: TemplateRef<any>,contatoId:number): void {
    event.stopPropagation(); //** esta função faz com que ao clicar na linha do botão delete da lista de eventos ele não propague abrindo a tela de evento-detalhe permanecendo na tela*/
    this.contatoId = contatoId;
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  confirm() : void {
    this.modalRef.hide();
    this.spinner.show();

    this.contatoService.delete(this.contatoId).subscribe(
      (result: any) => {
        console.log(result);
        this.toastr.success('O Contato foi deletado com Sucesso','Sucesso!');
        this.carregarContatos();
      },
      (error: any) => {
        console.error(error);
        this.toastr.error(`Erro ao tentar deletar o contato ${this.contatoId}`,'Erro!');
      }


    ).add( () => this.spinner.hide() );

  }

  decline() : void {
    this.modalRef.hide();
  }

  detalheContato(id:number): void {
    this.router.navigate([`contatos/detalhe/${id}`]);

  }

}
