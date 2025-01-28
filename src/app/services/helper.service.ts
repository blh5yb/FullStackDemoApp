import { ApplicationRef, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  dark_theme = new BehaviorSubject(window.matchMedia("(prefers-color-scheme: dark)").matches);
  isMobile = new BehaviorSubject(!!(window.innerWidth <= 575))
  isSmallScreen = new BehaviorSubject(!!(window.innerWidth <= 767))


  constructor(
    private ref: ApplicationRef,
    private router: Router,

  ) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener('change', e => {
      this.dark_theme.next(e.matches ? true : false);
      ref.tick();
    })
    window.addEventListener("resize", () => {
      this.isMobile.next(!!(window.innerWidth <= 575))
    });
    window.addEventListener("resize", () => {  // screen.width is whole screen
      this.isSmallScreen.next(!!(window.innerWidth <= 767)) // 1080
    });
  }

  navigate(path: string, params: any = {}){
    this.router.navigate([path], {replaceUrl: true, queryParams: params})
  }

  deepCopy(myObj: any){
    return JSON.parse(JSON.stringify(myObj))
  }

  round(input: number){
    return (Math.round(100 * input)/100)
  }

  objArrCompare(arrA: any, arrB: any){
    return _.isEqual(arrA, arrB)
  }

  getSubString(input: string, start: number, end: number){
   return input.substring(start, end)
  }

  createPhone(phone: any){
    phone = phone.replace(/[-()+ ]/g, "").trim()
    let lastFour = this.getSubString(phone, (phone.length - 4), (phone.length))
    let firstThree = this.getSubString(phone, (phone.length - 7), (phone.length - 4))
    let areaCode = this.getSubString(phone, (phone.length - 10), (phone.length - 7))
    let countryCode = ''
    if (phone.length > 10){
      countryCode = this.getSubString(phone, 0, (phone.length - 10))
      countryCode = countryCode.includes('+') ? countryCode.trim() : `+${countryCode.trim()}`
    }
    countryCode = countryCode ? `${countryCode.trim()} ` : ''
    areaCode = areaCode ? `(${areaCode.trim()}) ` : ''
    firstThree = firstThree ? `${firstThree.trim()}-` : ''
    if (`${countryCode}${areaCode}${firstThree}${lastFour}`){
      return `${countryCode}${areaCode}${firstThree}${lastFour}`
    }
    return
  }
}
