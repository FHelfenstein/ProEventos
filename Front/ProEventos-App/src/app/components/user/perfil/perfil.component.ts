import { Component, OnInit } from '@angular/core';
import { Evento } from '@app/models/Evento';
import { UserUpdate } from '@app/models/identity/UserUpdate';
import { PaginatedResult, Pagination } from '@app/models/Pagination';
import { AccountService } from '@app/services/account.service';
import { EventoService } from '@app/services/evento.service';
import { environment } from '@environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  public usuario = {} as UserUpdate;
  public file: File;
  public imagemURL = '';
  public eventosCriados = 0;
  public eventosPalestrante = 0;
  public pagination = {} as Pagination;

  public get ehPalestrante(): boolean {
    return this.usuario.funcao == 'Palestrante';
  }

  constructor(
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private accountService: AccountService,
    private eventoService: EventoService
  ){ }

  ngOnInit(): void {
    this.pagination = {
      currentPage: 1,
      itemsPerPage: 3,
      totalPages: 1
    } as Pagination;
    this.getEventosCriados();
  }

  public getEventosCriados(): void {
     this.spinner.show();
    // this.eventoService
    // .getEventos(this.pageNumber, this.pageSize)
    // .subscribe(
    //   (paginatedResult: PaginatedResult<Evento[]>) => {
    //     this.eventos = paginatedResult.result;
    //     this.eventos.forEach(() => { this.eventosCriados = this.eventosCriados + 1;})
    //   },
    //   () => {
    //     this.toastr.error('Erro ao Carregar Eventos.','Erro!');
    //   }
    // ).add( () => this.spinner.hide() );
    // return this.eventosCriados;

    this.eventoService
        .getEventos(
          this.pagination.currentPage,
          this.pagination.itemsPerPage)
          .subscribe(
            (paginatedResult: PaginatedResult<Evento[]>) => {
              this.pagination = paginatedResult.pagination;
              this.eventosCriados = this.pagination.totalItems;
            },
            () => {
              this.toastr.error('Erro ao Carregar Eventos.','Erro!');
            }
          ).add( ()=> this.spinner.hide());
  }

  public getEventosByPalestrante() : void {
      this.spinner.show();

      this.eventoService.getEventosByPalestrante(this.usuario.id)
        .subscribe(
            (result: any) => {
              console.log(result);
              if(result.message == "Eventos Calculados.") {
                this.toastr.success("Eventos calculados.","Sucesso!");
                this.eventosPalestrante = result.totalEventos;
              }
            },
            (error:any) => {
              console.error(error);
              this.toastr.error("Erro ao tentar calcular os eventos","Error!");
            }
        );
  }

  public setFormValue(usuario: UserUpdate): void {
    this.usuario = usuario;

    if(this.usuario.id !== 0) {
     this.getEventosByPalestrante();
    }

    if (this.usuario.imagemURL)
      this.imagemURL = environment.apiURL + `resources/perfil/${this.usuario.imagemURL}`;
    else
      this.imagemURL = './assets/img/perfil.png';
  }

  onFileChange(ev: any) : void {
    const reader = new FileReader();

    reader.onload = (event:any) => this.imagemURL = event.target.result;

    this.file = ev.target.files; // vou atribuir a minha variável file, todos os files que eu vou recebendo no meu HTML no caso o input
    reader.readAsDataURL(this.file[0]); // estou carregando/lendo os arquivos do meu HTML nesse caso somente uma imagem;

    this.uploadImagem();
  }

  private uploadImagem() : void {
    this.spinner.show();

    this.accountService.postUpload(this.file).subscribe(
        () => this.toastr.success("Imagem Atualizada com Sucesso.","Sucesso!"),
        (error: any) => {
          this.toastr.error("Erro ao Fazer Upload de Imagem.","Erro!")
          console.error(error)
        }

    ).add( () => this.spinner.hide() );
  }

}


