import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { Evento } from '../models/Evento';

@Injectable(
  //{ providedIn: "root"}
)
export class EventoService {
  //baseURL = "https://localhost:5001/api/eventos";
  baseURL = environment.apiURL + "api/eventos";

  constructor(private http: HttpClient) { }

  public getEventos(): Observable<Evento[]> // tipado por Array de Evento
  {
    return this.http.get<Evento[]>(this.baseURL)
      .pipe(take(1)); /**definido através do take a quantidade de vezes que poderá executar a função "this.http.get", depois vai desinscrever o observable
                         automaticamente você não consegue fazer mais nada ou seja se manter inscrito */
  }

  public getEventosByTema(tema: string): Observable<Evento[]> // tipado por Array de Evento
  {
    return this.http.get<Evento[]>(`${this.baseURL}/${tema}/tema`)
      .pipe(take(1));
  }

  public getEventoById(id:number): Observable<Evento> // Tipado por Evento
  {
    return this.http.get<Evento>(`${this.baseURL}/${id}`)
      .pipe(take(1));
  }

  public post(evento:Evento): Observable<Evento> {
    return this.http.post<Evento>(this.baseURL, evento)
      .pipe(take(1));
  }

  public put(evento: Evento): Observable<Evento> {
    return this.http.put<Evento>(`${this.baseURL}/${evento.id}`, evento)
      .pipe(take(1));
  }

  public deleteEvento(id:number): Observable<any> {
    return this.http.delete(`${this.baseURL}/${id}`)
      .pipe(take(1));
  }

  postUpload(eventoId: number, file: File) : Observable<Evento> {
    const fileToUpload = file[0] as File;
    const formData = new FormData();
    formData.append('file',fileToUpload);

    return this.http.post<Evento>(`${this.baseURL}/upload-image/${eventoId}`, formData)
    .pipe(take(1));
  }
}
