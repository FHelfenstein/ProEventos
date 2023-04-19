import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Contato } from '@app/models/Contato';
import { ContatoService } from '@app/services/contato.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contato-detalhe',
  templateUrl: './contato-detalhe.component.html',
  styleUrls: ['./contato-detalhe.component.scss']
})
export class ContatoDetalheComponent implements OnInit {
  modalRef: BsModalRef;
  contatoId: number;
  contato = {} as Contato;
  form: FormGroup;
  estadoSalvar = 'post';

  get f(): any {
    return this.form.controls;
  }

  constructor(
    private fb: FormBuilder,
    private activateRoute: ActivatedRoute,
    private router: Router,
    private contatoService: ContatoService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.carregarContato()
    this.validation()
  }

  public carregarContato() : void {
    this.contatoId = +this.activateRoute.snapshot.paramMap.get('id');

    if(this.contatoId !== null && this.contatoId !== 0) {

      // é modo de edição UPDATE
      this.estadoSalvar = 'put';

      this.spinner.show();

      this.contatoService.getContatoById(this.contatoId)
        .subscribe(
          (contatoRetorno: Contato) => {
            this.contato = {... contatoRetorno};
            this.form.patchValue(this.contato);
          },
          (error: any) => {
            console.error(error);
            this.toastr.error('Erro ao tentar Carregar Contato.','Erro!');
          }

        ).add( () => this.spinner.hide() );
    }
  }

  public validation() : void {
    this.form = this.fb.group({
      nome:['', [Validators.required,Validators.minLength(4),Validators.maxLength(40)]],
      cargo:['',Validators.required],
      telefone:['',Validators.required],
      email:['',[Validators.required, Validators.email]]
    });
  }

  public cssValidator(campoForm: FormGroup) : any {
    return {'is-invalid': campoForm.errors && campoForm.touched};
  }

  public resetForm() : void {
    this.form.reset();
  }

  public salvarContato() : void {
    if(this.form.valid) {
      this.spinner.show();

      this.contato = (this.estadoSalvar == 'post')
        ? {...this.form.value} // spread operator pega os dados do formulário e salva no objeto this.contato
        : {id: this.contato.id, ...this.form.value}

        this.contatoService[this.estadoSalvar](this.contato).subscribe(
          (response: Contato) => {
            this.toastr.success('Contato foi Salvo Com Sucesso.','Sucesso!');

            // redirecionar para a tela de detalhes do contato com o novo id gerado
            this.router.navigate([`contatos/detalhe/${response.id}`]);
            //this.router.navigate([`contatos/lista`]);
          },
          (error: any) => {
            console.error(error);
            this.toastr.error('Erro ao Salvar o Contato.','Erro!');
          }

        ).add( () => this.spinner.hide() );

    }

  }

}
