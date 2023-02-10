import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidatorField } from '@app/helpers/ValidatorField';
import { UserUpdate } from '@app/models/identity/UserUpdate';
import { AccountService } from '@app/services/account.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  userUpdate = {} as UserUpdate;
  form!: FormGroup;

  constructor(private fb: FormBuilder,
              public accountService: AccountService,
              private router: Router,
              private toaster: ToastrService,
              private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.validation();
    this.carregarUsuario();
  }

  private carregarUsuario(): void {
    this.spinner.show();

    this.accountService.getUser().subscribe(
      (userRetorno: UserUpdate) => {
        console.log(userRetorno);
        this.userUpdate = userRetorno;
        this.form.patchValue(this.userUpdate);
        this.toaster.success("Usuário Carregado.","Sucesso!");
      },
      (error: any) => {
        console.error(error);
        this.toaster.error("Usuário não Carregado.","Erro!");
        this.router.navigate(['/dashboard']);

      }

    ).add(() => this.spinner.hide());
  }

  private validation():void {
    const formOptions: AbstractControlOptions = {
      validators: ValidatorField.MustMatch('password','confirmePassword')
    };

    this.form = this.fb.group({
      userName:[''],
      titulo:['NaoInformado',[Validators.required]],
      primeiroNome:['',[Validators.required]],
      ultimoNome:['',[Validators.required]],
      email:['',[Validators.required,Validators.email]],
      phoneNumber:['',[Validators.required]],
      funcao:['NaoInformado',[Validators.required]],
      descricao:['',[Validators.required]],
      password:['',[Validators.required,Validators.minLength(4)]],
      confirmePassword:['',[Validators.required]],

    },formOptions);
  }

  // Conveniente para pegar um FormField apenas com a letra F
  get f(): any
  {
    return this.form.controls
  };

  // Vai parar aqui se o form estiver inválido
  onSubmit(): void
  {
    this.atualizarUsuario();
  }

  public atualizarUsuario() {
    this.userUpdate = {... this.form.value }; // utilizando o spread operator para carregar os dados do formulário pra o objeto userUpdate
    this.spinner.show();

    //console.log("#accountService ",JSON.stringify(this.userUpdate));

    this.accountService
      .updateUser(this.userUpdate)
      .subscribe(
        () => this.toaster.success("Usuário Atualizado.","Sucesso!"),
        (error: any) => {
          this.toaster.error(error.error);
          console.error(error);
        }
      ).add( () => this.spinner.hide() );

  }

  public resetForm(event:any): void {
    event.preventDefault();
    this.form.reset();
  }

  public cssValidator(campoForm:FormGroup) : any {
    return {'is-invalid': campoForm.errors && campoForm.touched };
  }

}


