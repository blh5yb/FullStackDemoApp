import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-qual-modal',
  templateUrl: './qual-modal.component.html',
  styleUrls: ['./qual-modal.component.scss'],
})
export class QualModalComponent  implements OnInit {

  qual
  qualRange = {lower: 0, upper: 100}
  updated = false;

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.qualRange = {lower: this.qual.min, upper: this.qual.max}
  }

  updateRange(event: any){
    this.qual.min = event.detail.value.lower
    this.qual.max = event.detail.value.upper
    this.qualRange = event.detail.value
    this.updated = true;
  }

  pinFormatter(value: number) {
    return `${value}`;
  }

  done(){
    this.modalCtrl.dismiss({qual: this.qual})
  }

  cancel(){
    this.modalCtrl.dismiss();
  }

}
