import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SerieService } from '../service/serie/serie.service';
import { Serie } from '../model/serie';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  series: Serie[];
  generos: string[];
  buscarGenero: string;
  clicked: boolean;
  index: number;

  constructor(private router: Router,
    private service: SerieService,
    private alert: AlertController) {
      this.generos = this.service.getGeneros();
      this.getData();
      this.buscarGenero = "todos";
      this.clicked = false;
      this.index = 0;
  }

  getData() {
    this.service.getSeries().subscribe(
      data => {
        this.series = data;
      }
    );
  }

  showDetails(id: number) {
    let aux = this.series.findIndex(s => s.id == id);
    this.clicked = !this.clicked;
    if (aux != this.index) {
      this.index = this.series.findIndex(s => s.id == id);
      this.clicked = !this.clicked;
    }
  }

  addToFavoritos(serie: Serie) {
    this.service.addToFavoritos(serie);
  }

  deleteFromFavoritos(serie: Serie) {
    this.service.deleteFromFavoritos(serie);
  }

  async alertDeleteFavorito(serie: Serie) {
    const alert = await this.alert.create({
      header: `¿Eliminar ${serie.titulo} de los favoritos?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Quitar',
          cssClass: 'danger',
          handler: () => {
            this.deleteFromFavoritos(serie);
          }
        }
      ]
    });
    await alert.present();
  }
}
