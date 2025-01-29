import { Directive, Renderer2, ElementRef } from '@angular/core';

@Directive({
  selector: '[appAutoHide]', 
  host: {
    '(ionScroll)': 'onContentScroll($event)'
  }
})
export class AutoHideDirective {

  fabToHide: HTMLElement;

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) { }

  ionViewDidEnter(): void {
  }

  ngOnInit(){
  }

  ngAfterViewInit(){
    this.fabToHide = this.elementRef.nativeElement.querySelector('ion-fab')  //document.getElementsByClassName("fab")[0]
    
    this.renderer.setStyle(this.fabToHide, "opacity", "0")
    this.renderer.setStyle(this.fabToHide, "webkitTransition", "transform 500ms, opacity 500ms")
  }

  async onContentScroll(e: any){
    
    const scrollElement = await e.target.getScrollElement();
    if(scrollElement.scrollTop >= (scrollElement.clientHeight / 2)) {
      console.log(scrollElement.scrollTop, (scrollElement.clientHeight / 2))
      // this ensures that the event only triggers once
      // do your analytics tracking here
      //this.fabToHide.style.opacity = '1'
      this.renderer.setStyle(this.fabToHide, "opacity", "1")
      this.renderer.setStyle(this.fabToHide, "webkitTransform", "scale3d(1, 1, 1)")
    } else {
      //this.fabToHide.style.opacity = '0'
      this.renderer.setStyle(this.fabToHide, "opacity", "0")
      this.renderer.setStyle(this.fabToHide, "webkitTransform", "scale3d(.1, .1, .1)")
    }
  }
}
