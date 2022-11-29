import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { Evento } from '@app/models/Evento';
import { EventoService } from '@app/services/evento.service';
import { Constants } from '@app/util/constants';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss']
})
export class EventoDetalheComponent implements OnInit {
  evento = {} as Evento;
  form!: FormGroup;
  estadoSalvar: string = 'post';

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

  constructor(private fb: FormBuilder,
              private localeService: BsLocaleService,
              private router:ActivatedRoute,
              private eventoService:EventoService,
              private spinner: NgxSpinnerService,
              private toastr: ToastrService)
  {
    this.localeService.use(Constants.LOCALE_PT_BR);
  }

  ngOnInit(): void {
    this.carregarEvento();
    this.validation();
  }

  public carregarEvento(): void {
    const eventoIdParam = this.router.snapshot.paramMap.get('id');

    if (eventoIdParam !== null) {
      /*definindo o estado do meu formulário aqui neste caso quando carrego um evento estou indicando uma alteração neste caso é put o padrão
      é sempre entrar com o estado como post pois quando você clica no botão novo o formulário fica todo em branco neste caso a variável já
      é instanciada lá no início da classe*/
      this.estadoSalvar = 'put';

      this.spinner.show();
      this.eventoService.getEventoById(+eventoIdParam).subscribe(
        (evento: Evento) => {
          //**utilizando spread  ... */
          this.evento = {...evento};
          this.form.patchValue(this.evento);
        },
        (error:any) => {
          this.spinner.hide();
          this.toastr.error("Erro ao tentar carregar o evento.","Erro!");
          console.error(error);
        },
        () => this.spinner.hide(),
      );
    }
  }

  private validation() : void{
    this.form = this.fb.group({
      tema:['',[Validators.required,Validators.minLength(4),Validators.maxLength(50)]],
      local:['',Validators.required],
      dataEvento:['',Validators.required],
      qtdPessoas:['',[Validators.required,Validators.max(120000)]],
      telefone:['',Validators.required],
      email:['',[Validators.required,Validators.email]],
      imagemURL:['',Validators.required],
    });
  }

  public resetForm(): void {
    this.form.reset();
  }

  public cssValidator(campoForm:FormGroup) : any {
    return {'is-invalid': campoForm.errors && campoForm.touched};
  }

  public salvarAlteracao() : void {
    this.spinner.show();

    if (this.form.valid) {

      this.evento = (this.estadoSalvar == 'post')
          ? {...this.form.value}
          : {id: this.evento.id, ...this.form.value};

        this.eventoService[this.estadoSalvar](this.evento).subscribe(
          () => this.toastr.success('Evento Salvo com Sucesso','Sucesso!'),
          (error: any) => {
            console.error(error);
            this.spinner.hide();
            this.toastr.error('Erro ao Salvar o Evento','Erro!');
          },
          () => this.spinner.hide()
        );
      }


  }

}
