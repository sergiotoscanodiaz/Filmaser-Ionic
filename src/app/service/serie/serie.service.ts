import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Serie } from 'src/app/model/serie';

@Injectable({
  providedIn: 'root'
})
export class SerieService {

  generos: string[] = [];
  generosAux: string[] = [];
  favoritos: Serie[] = [];

  constructor(private httpClient: HttpClient,
    private storage: Storage) {
    this.getSeries().subscribe(
      data => {
        data.forEach(f => {
          f.generos.forEach(e => {
            this.generosAux.push(e);
          });
          f.esFav = false;
        });
        this.generosAux.forEach(g => {
          if (!this.generos.includes(g)) {
            this.generos.push(g);
          }
        });
      }
    );
    this.getFavoritos().then(
      data => this.favoritos = data == null ? [] : data
    );
  }

  getGeneros(): string[] {
    return this.generos;
  }

  getSeries(): Observable<any> {
    return this.httpClient.get('assets/data.json');
  }

  getFavoritos(): Promise<Serie[]> {
    return this.storage.get('favoritos');
  }

  addToFavoritos(serie: Serie): Promise<boolean> {
    serie.esFav = true;
    this.favoritos.push(serie);
    return this.storage.set('favoritos', this.favoritos);
  }

  deleteFromFavoritos(serie: Serie): Promise<boolean> {
    serie.esFav = false;
    this.favoritos = this.favoritos.filter(f => f.id != serie.id);
    return this.storage.set('favoritos', this.favoritos);
  }
}
