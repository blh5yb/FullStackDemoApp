import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-chromosome-modal',
  templateUrl: './chromosome-modal.component.html',
  styleUrls: ['./chromosome-modal.component.scss'],
})
export class ChromosomeModalComponent  implements OnInit {

  chromosomes = []
  selectedChromosomes = []
  updated = false;

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {}

  chooseChromosome(index:number){
    this.selectedChromosomes[index].selected = !this.selectedChromosomes[index].selected
    this.updated = true;
  }

  done(){
    this.modalCtrl.dismiss({chromosomes: this.selectedChromosomes})
  }
  cancel(){
    this.modalCtrl.dismiss()
  }

}
