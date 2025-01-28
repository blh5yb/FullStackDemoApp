import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-vartype-modal',
  templateUrl: './vartype-modal.component.html',
  styleUrls: ['./vartype-modal.component.scss'],
})
export class VartypeModalComponent  implements OnInit {

  variantTypes
  updated = false

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {}

  chooseVTypes(index: number){
    this.variantTypes[index].selected = !this.variantTypes[index].selected
    this.updated = true;
  }

  done(){
    this.modalCtrl.dismiss({variant_type: this.variantTypes})
    this.updated = true;
  }

  cancel(){
    this.modalCtrl.dismiss();
  }

}
