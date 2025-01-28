import { Component, OnInit } from '@angular/core';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent  implements OnInit {

  constructor(
    private helperService: HelperService
  ) { }

  ngOnInit() {}

  goToLink(){
    this.helperService.goToLink('https://github.com/blh5yb/FullStackDemoApp')
  }

}
