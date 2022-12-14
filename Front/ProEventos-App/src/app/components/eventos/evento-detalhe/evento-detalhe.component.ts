import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl,
         FormArray,
         FormBuilder,
         FormGroup,
         Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { EventoService } from '@app/services/evento.service';
import { LoteService} from '@app/services/lote.service';

import { Evento } from '@app/models/Evento';
import { Lote } from '@app/models/Lote';

import { Constants } from '@app/util/constants';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss']
})

export class EventoDetalheComponent implements OnInit {
  modalRef: BsModalRef;
  eventoId: number;
  evento = {} as Evento;
  form: FormGroup;
  estadoSalvar = 'post';
  loteAtual = {id: 0 , nome:'', indice: 0};
  imagemURL = 'assets/img/upload.png';
  file : File;

  mudarValorData(value:Date , indice:number, campo:string): void {
    this.lotes.value[indice][campo] = value;
  }

  get modoEditar() : boolean {
    return this.estadoSalvar == 'put';
  }

  get lotes(): FormArray {
    return this.form.get('lotes') as FormArray;
  }

  get f(): any {
    return this.form.controls;
  }

  get bsConfig(): any {
    return {
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY hh:mm a',
      containerClass:'theme-default',
      showWeekNumbers: false
    };
  }

  get bsConfigLote(): any {
    return {
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY',
      containerClass:'theme-default',
      showWeekNumbers: false
    };
  }

  constructor(
    private fb: FormBuilder,
    private localeService: BsLocaleService,
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private eventoService:EventoService,
    private loteService: LoteService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private modalService: BsModalService,
  ) {
    this.localeService.use(Constants.LOCALE_PT_BR);
  }

  ngOnInit(): void {
    this.carregarEvento();
    this.validation();
  }

  public carregarEvento(): void {
    this.eventoId = +this.activatedRoute.snapshot.paramMap.get('id');

    if (this.eventoId !== null && this.eventoId !== 0) {
      /*definindo o estado do meu formulário aqui neste caso quando carrego um evento estou indicando uma alteração neste caso é put o padrão
      é sempre entrar com o estado como post pois quando você clica no botão novo o formulário fica todo em branco neste caso a variável já
      é instanciada lá no início da classe*/
      this.estadoSalvar = 'put';

      this.spinner.show();
      this.eventoService
        .getEventoById(this.eventoId)
        .subscribe(
          (evento: Evento) => {
            //**utilizando spread  ... */
            this.evento = {...evento};
            this.form.patchValue(this.evento);
            if(this.evento.imagemURL !=='')
            {
              this.imagemURL = `${environment.apiURL}resources/images/${this.evento.imagemURL}`;
            }
            this.carregarLotes();
          },
          (error:any) => {
            this.toastr.error("Erro ao tentar carregar o evento.","Erro!");
            console.error(error);
          },
        ).add(() => this.spinner.hide());
    }
  }

  public carregarLotes(): void {
    this.loteService.getLotesByEventoId(this.eventoId).subscribe(
      (lotesRetorno: Lote[]) => {
        lotesRetorno.forEach(lote => {
          this.lotes.push(this.criarLote(lote));
        });
      },
      (error: any) => {
        console.error(error);
        this.toastr.error("Erro ao tentar carregar lotes.","Erro!");
      },
    ).add(() => this.spinner.hide() );

  }

  public validation() : void{
    this.form = this.fb.group({
      tema:['',[Validators.required,Validators.minLength(4),Validators.maxLength(50)]],
      local:['',Validators.required],
      dataEvento:['',Validators.required],
      qtdPessoas:['',[Validators.required,Validators.max(120000)]],
      telefone:['',Validators.required],
      email:['',[Validators.required,Validators.email]],
      imagemURL:[''],
      lotes: this.fb.array([]),
    });
  }

  adicionarLote() : void {
    this.lotes.push(this.criarLote({ id: 0 } as Lote));
  }

  criarLote(lote: Lote): FormGroup {
    return this.fb.group({
      id:[lote.id ],
      nome:[lote.nome ,Validators.required],
      quantidade:[lote.quantidade , Validators.required],
      preco:[lote.preco, Validators.required],
      dataInicio:[lote.dataInicio],
      dataFim:[lote.dataFim],
    });
  }

  public resetForm(): void {
    this.form.reset();
  }

  public retornaTituloLote(nome: string) : string {
    return nome == null || nome == '' ? 'Nome do Lote' : nome;

  }

  public cssValidator(campoForm:FormGroup | AbstractControl) : any {
    return {'is-invalid': campoForm.errors && campoForm.touched};
  }

  public salvarEvento() : void {
    if (this.form.valid) {
      this.spinner.show();

      this.evento = (this.estadoSalvar == 'post')
          ? {...this.form.value}
          : {id: this.evento.id, ...this.form.value};

        this.eventoService[this.estadoSalvar](this.evento).subscribe(
          (eventoRetorno: Evento) => {
            this.toastr.success('Evento Salvo com Sucesso','Sucesso!');
            // chamar novamente a tela de evento de detalhe carregando o novo ID que foi gerado
            // que por consequência vai abrir em modo de edição o formulário de lotes
            this.router.navigate([`eventos/detalhe/${eventoRetorno.id}`]);
          },
          (error: any) => {
            console.error(error);
            this.toastr.error('Erro ao Salvar o Evento','Erro!');
          },
        ).add(() => this.spinner.hide());
      }
  }

  public salvarLotes() : void {
    if(this.form.controls.lotes.valid) {
      this.spinner.show();
      this.loteService.saveLote(this.eventoId, this.form.value.lotes)
        .subscribe(
          () => {
            this.toastr.success('Lotes salvos com Sucesso.','Sucesso!');
            //this.lotes.reset();
          },
          (error: any) => {
            this.toastr.error('Erro ao tentar salvar lotes','Erro!');
            console.error(error);
          }
        ).add(() => this.spinner.hide());
    }
  }

  public removerLote(template: TemplateRef<any>,
                     indice:number): void {

    this.loteAtual.id = this.lotes.get(indice + '.id').value;
    this.loteAtual.nome = this.lotes.get(indice + '.nome').value;
    this.loteAtual.indice = indice;

    this.modalRef = this.modalService.show(template, {class: 'modal-sm' });
  }

  confirmDeleteLote():void {
    this.modalRef.hide();
    this.spinner.show();

    this.loteService.deleteLote(this.eventoId,this.loteAtual.id)
      .subscribe(
        () => {
          this.toastr.success("Lote deletado com sucesso.","Sucesso!");
          this.lotes.removeAt(this.loteAtual.indice);
        },
        (error:any) => {
          console.error(error);
          this.toastr.error(`Erro ao tentar deletar o lote ${this.loteAtual.id}`,"Erro!");
        }
      ).add(() => this.spinner.hide() );
  }

  declineDeleteLote():void {
    this.modalRef.hide();
  }

  onFileChange(ev: any) : void {
    const reader = new FileReader();

    reader.onload = (event:any) => this.imagemURL = event.target.result;

    this.file = ev.target.files; // vou atribuir a minha variável file, todos os files que eu vou recebendo no meu HTML no caso o input
    reader.readAsDataURL(this.file[0]); // estou carregando/lendo os arquivos do meu HTML nesse caso somente uma imagem;

    this.uploadImagem();
  }

  uploadImagem(): void {
    this.spinner.show();
    this.eventoService.postUpload(this.eventoId,this.file).subscribe(
      () => {
        this.carregarEvento();
        this.toastr.success("Imagem atualizada com sucesso","Sucesso!");
      },
      (error:any) => {
        console.error(error);
        this.toastr.error("Erro ao fazer upload da imagem","Erro!");

      }
    ).add( () => this.spinner.hide() );

  }

}
