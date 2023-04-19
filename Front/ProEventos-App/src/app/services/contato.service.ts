import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contato } from '@app/models/Contato';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ContatoService {

  baseURL = environment.apiURL + "api/contatos";

  constructor(private http: HttpClient) { }

  public getContatos(nome: string) : Observable<Contato[]> {

    return this.http
      .get<Contato[]>(this.baseURL)
      .pipe(take(1));
  }

  public getContatoById(id: number) : Observable<Contato> {
    return this.http
      .get<Contato>(`${this.baseURL}/${id}`)
      .pipe(take(1));
  }

  public post(contato: Contato) : Observable<Contato> {
    return this.http
      .post<Contato>(this.baseURL, contato)
      .pipe(take(1));
  }

  public put(contato: Contato) : Observable<Contato> {
    return this.http
      .put<Contato>(`${this.baseURL}/${contato.id}`, contato)
      .pipe(take(1));
  }

  public delete(id: number) : Observable<any> {
    return this.http
      .delete(`${this.baseURL}/${id}`)
      .pipe(take(1));
  }

}
