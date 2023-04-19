import { Evento } from '../models/Evento';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { PaginatedResult } from '@app/models/Pagination';

@Injectable(
  //{ providedIn: "root"}
)
export class EventoService {
  //baseURL = "https://localhost:5001/api/eventos";
  baseURL = environment.apiURL + "api/eventos";
  //tokenHeader = new HttpHeaders({ 'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).token}` });
  //tokenHeader = new HttpHeaders({ 'Authorization': 'Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxIiwidW5pcXVlX25hbWUiOiJmZXJuYW5kbyIsIm5iZiI6MTY3NTcwNjU4NCwiZXhwIjoxNjc1NzkyOTg0LCJpYXQiOjE2NzU3MDY1ODR9.6LN7g3ERWBP6hsogHHLRLo2x0Wo6APtQgD--Ka4V06bpVbnj1Ne__L2X53Z1nBLZ9DNufU2IYGknLlf6RUQ5Ww' });
  /// o token agora é retornado através da classe JwtInterceptor

  constructor(private http: HttpClient) { }

  public getEventos(page?: number, itemsPerPage?: number, term?: string): Observable<PaginatedResult<Evento[]>> // tipado por Array de Evento
  {
    const paginatedResult: PaginatedResult<Evento[]> = new PaginatedResult<Evento[]>();

    let params = new HttpParams;

    if(page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page.toString());
      params = params.append('pageSize', itemsPerPage.toString());
    }

    if(term != null && term != '') {
      params = params.append('term',term);
    }

    return this.http
    .get<Evento[]>(this.baseURL, {observe: 'response',params })
    .pipe(
      take(1),
      map((response) => {
        paginatedResult.result = response.body;
        if(response.headers.has('Pagination')) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }
        return paginatedResult;
      }));
       /**definido através do take a quantidade de vezes que poderá executar a função "this.http.get", depois vai desinscrever o observable
          automaticamente você não consegue fazer mais nada ou seja se manter inscrito */
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

  public getEventosByPalestrante(userId:number): Observable<any> {
      return this.http.get(`${this.baseURL}/count/${userId}`)
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
