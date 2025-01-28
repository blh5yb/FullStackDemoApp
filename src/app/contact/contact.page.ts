import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { WidgetService } from '../services/widget.service';
import { HelperService } from '../services/helper.service';
import { distinctUntilChanged } from 'rxjs';
import { BackendService } from '../services/backend.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {

  contactForm: FormGroup;
  charsLimit = 500;
  charsUsed = 0;
  isLoading = false;
  isMobile = false;

  contact_phone: any = ''

  constructor(
    private widgetService: WidgetService,
    private helperService: HelperService,
    private backendService: BackendService
  ) { }

  ngOnInit() {
    this.helperService.isMobile.subscribe((mobile: any) => {
      this.isMobile = mobile
    })
    this.initContactForm()
    this.contactForm.valueChanges.pipe(distinctUntilChanged()).subscribe(
      ((res: any) => {
        this.charsUsed = res.summary.length
        if (res.phone && res.phone !== this.contact_phone){
          this.createPhone(res.phone)
        }
      })
    )
  }

  async backendTest(){
    const data = {
      "subject": "Demo site mail",
      "msgBody": "test",
      "recipient": environment.host_email
    }
    const res = await this.backendService.sendEmail(data)
  }

  initContactForm(){
    this.contactForm = new FormGroup({
      'name': new FormControl('', Validators.required),
      'email': new FormControl('', [Validators.required, Validators.email]),
      'phone': new FormControl(this.contact_phone, Validators.minLength(14)),
      'summary': new FormControl('', [Validators.required, Validators.maxLength(this.charsLimit)])
    })
  }

  async sendEmail(){
    let body = `
      name: ${this.contactForm.controls.name.value}<br>
      email: ${this.contactForm.controls.email.value}<br>
    `
    if (this.contactForm.controls.phone.value){
      body += `phone: ${this.contactForm.controls.phone.value}<br>`
    }
    let msgBody = `<p>
      ${body}
      summary: ${this.contactForm.controls.summary.value}<br>
    </p>`
    const data = {
      "subject": "Demo site mail",
      "msgBody": msgBody,
      "recipient": environment.host_email
    }
    const res = await this.backendService.sendEmail(data)
    if (res){
      this.widgetService.presentToast("Successfully sent email. I will be in contact with you at my earliest convenience")
      this.initContactForm();
      this.helperService.navigate('/home')
    } else {
      this.widgetService.presentAlert("Error sending email. Please try again later")
    }
  }

  get phone() {return this.contactForm.get('phone')}
  get name() {return this.contactForm.get('name')}
  get email() {return this.contactForm.get('email')}
  get summary() {return this.contactForm.get('summary')}

  createPhone(event: any){
    this.contact_phone = this.helperService.createPhone(event)
    if (this.contact_phone.trim().length){
      this.contactForm.get('phone').setValue(this.contact_phone)
      this.contactForm.get('phone').setValidators(Validators.minLength(14))
      this.contactForm.get('phone').updateValueAndValidity();
    } else {
      this.contactForm.get('phone').clearValidators();
      this.contactForm.get('phone').updateValueAndValidity();
    }
    return this.contact_phone
  }

}
