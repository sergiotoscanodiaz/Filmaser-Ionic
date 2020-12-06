import { Component, OnInit } from '@angular/core';
import { SerieService } from 'src/app/service/serie/serie.service';
import { Serie } from 'src/app/model/serie';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
})
export class FavoritosPage implements OnInit {

  favoritos: Serie[] = [];
  clicked: boolean;
  index: number;

  constructor(private service: SerieService, 
    private router: Router,
    private alert: AlertController) { }

   ngOnInit() {
    this.service.getFavoritos().then(
      data => this.favoritos = data == null ? [] : data
    );
   }

   showDetails(id: number) {
    this.clicked = !this.clicked;
    this.index = this.favoritos.findIndex(s => s.id == id);
  }

  deleteFromFavoritos(serie: Serie) {
    this.service.deleteFromFavoritos(serie).then(
      () => this.service.getFavoritos().then(
        data => this.favoritos = data == null ? [] : data
      )
    );
    this.clicked = !this.clicked;
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
