import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule} from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale} from 'ngx-bootstrap/locale';

import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxCurrencyModule } from 'ngx-currency';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PalestrantesComponent} from './components/palestrantes/palestrantes.component';
import { TituloComponent } from './shared/titulo/titulo.component';
import { NavComponent } from './shared/nav/nav.component';

import { EventosComponent } from './components/eventos/eventos.component';
import { EventoDetalheComponent } from './components/eventos/evento-detalhe/evento-detalhe.component';
import { EventoListaComponent } from './components/eventos/evento-lista/evento-lista.component';

import { UserComponent } from './components/user/user.component';
import { LoginComponent } from './components/user/login/login.component';
import { RegistrationComponent } from './components/user/registration/registration.component';
import { PerfilComponent } from './components/user/perfil/perfil.component';

import { ContatosComponent } from './components/contatos/contatos.component';

import { EventoService } from './services/evento.service';
import { LoteService } from './services/lote.service';

import { DateTimeFormatPipe } from './helpers/DateTimeFormat.pipe';
import { LocaleDatePipe } from './helpers/locale.pipe';

defineLocale('pt-br', ptBrLocale);

@NgModule({
  declarations: [
    AppComponent,
    ContatosComponent,
    DashboardComponent,
    EventosComponent,
    PalestrantesComponent,
    PerfilComponent,
    TituloComponent,
    NavComponent,
    DateTimeFormatPipe,
    LocaleDatePipe,
    EventoDetalheComponent,
    EventoListaComponent,
    UserComponent,
    LoginComponent,
    RegistrationComponent,
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CollapseModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    TooltipModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ToastrModule.forRoot({
        timeOut: 3000,
        positionClass: 'toast-bottom-right',
        preventDuplicates: true,
        progressBar: true,
    }),
    NgxSpinnerModule,
    NgxCurrencyModule,
  ],
  providers: [
    EventoService,
    LoteService,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
