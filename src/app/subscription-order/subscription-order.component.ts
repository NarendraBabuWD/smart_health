import { Component, OnInit, ViewChild, ChangeDetectorRef  } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { SubscriptionService } from '../services/subscription.service';
import { NotifyService } from '../services/notify.service';

import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ExternalLibraryService } from './util';

declare let Razorpay: any;
@Component({
  selector: 'app-subscription-order',
  templateUrl: './subscription-order.component.html',
  styleUrls: ['./subscription-order.component.css']
})
export class SubscriptionOrderComponent implements OnInit {

  isNotifyModalShown = false;
   billingValues;
   amount;
   billingData;
   doctorName: string;
   clinicName: string;
   clinicAddress: string;
   telephone: string;
   subscriptionType: string;
   subscriptionDuration: string;
   first_name: string;
   last_name: string;
   address: string;
   address2: string;
   postcode: string;
   state: string;
   country: string;
   subscription_type: string;
   subscription_duration: string;
   amountVal: string;
   tax: string;
   account_no: string;
   invoice: string;
   billingDate: string;
   total;
   orderNo;
   razorpayPaymentId;
   RAZORPAY_OPTIONS;
  razorpayResponse;
  showModal = false;
  sigdisplay = 'none';

  constructor(private _fb: FormBuilder, private toastrService: ToastrService
    , private subscriptionService: SubscriptionService,private router: Router,
    private notifyService: NotifyService,
    private razorpayService: ExternalLibraryService, private cd:  ChangeDetectorRef) { }


  ngOnInit() {
    this.getNotifications();
    this.billingValues = JSON.parse(sessionStorage.getItem("billingValues"));
    this.amount = JSON.parse(sessionStorage.getItem("amount"));
    this.billingData = JSON.parse(sessionStorage.getItem("billingData"));
    console.log(this.billingValues);
    console.log(this.amount);
    console.log(this.billingData);
    this. getInvoiceNo();
    this.doctorName = this.billingData.doctor_name;
    this.clinicName = this.billingData.name_of_clinic;
    this.clinicAddress = this.billingData.address_of_clinic_1;
    this.first_name = this.billingValues.first_name;
    this.last_name = this.billingValues.last_name;
    this.address = this.billingValues.address;
    this.address2 = this.billingValues.address_2;
    this.postcode = this.billingValues.postcode;
    this.state = this.billingValues.state;
    this.country = this.billingValues.country;
    this.subscription_type = this.billingValues.subscription_type;
    this.subscription_duration = this.billingValues.subscription_duration;

    this.amountVal = this.amount[0].amount;
    this.tax = this.amount[0].tax;
    this.account_no = this.amount[0].account_no;
    this.total = this.amountVal + this.tax;

    this.razorpayService
    .lazyLoadLibrary('https://checkout.razorpay.com/v1/checkout.js') 
    .subscribe();

  }

   getInvoiceNo(){    
    this.subscriptionService.getInvoiceNo().subscribe(invoiceNo => {
      // console.log(invoiceNo['data']);     
        this.invoice = invoiceNo['data'];
        sessionStorage.setItem('invoiceNo',JSON.stringify(this.invoice));
        this.billingDate = moment().format("DD/MM/YYYY");
    });
  }

  goToHome(){
    sessionStorage.removeItem("billingValues"); 
    sessionStorage.removeItem("amount"); 
    sessionStorage.removeItem("billingData"); 
    this.router.navigate(['/home']);  
  }
  goToSubscription(){
    sessionStorage.removeItem("billingValues"); 
    sessionStorage.removeItem("amount"); 
    sessionStorage.removeItem("billingData"); 
    this.router.navigate(['/subscription-account']); 
  }

  addBillingInfo(){
    this.hideAddModal();
    this.subscriptionService.createBillingInfo().subscribe(response => {
      console.log(response);     
      this.orderNo = response.data.order_id;
      this.addpayment(JSON.parse(sessionStorage.getItem("amount")),  this.orderNo);
    });
  }


  
  addpayment(amount, ordernum){
    // console.log(formData);
    // console.log(resData);
    
    
    this.RAZORPAY_OPTIONS = {
      "key": "rzp_test_2eBmIUMRQ076gE",
      "amount": amount[0].amount + amount[0].tax,
      "name": "RAZORPAY",
      // "order_id": ordernum,
      "description": "Load Wallet",
      "image": "https://livestatic.novopay.in/resources/img/nodeapp/img/Logo_NP.jpg",
      "prefill": {
        "name":  JSON.parse(sessionStorage.getItem("userdata")).firstname,
        "email": JSON.parse(sessionStorage.getItem("userdata")).email
      },
      "modal": {},
      "theme": {
        "color": "#0096C5"
      }
    };
  this.proceed();
  }

  proceed() {
    // this.RAZORPAY_OPTIONS.amount = 100 + '00';

    // binding this object to both success and dismiss handler
    this.RAZORPAY_OPTIONS['handler'] = this.razorPaySuccessHandler.bind(this);

    // this.showPopup();

    let razorpay = new Razorpay(this.RAZORPAY_OPTIONS)
    razorpay.open();
  }


  public razorPaySuccessHandler(response) {
    console.log(response);
    console.log(this.orderNo);
    if(response){
      this.updatePaymentStatus(this.orderNo, response.razorpay_payment_id);
    }
    this.razorpayResponse = `Razorpay Response`;
    this.showModal = true;
    this.cd.detectChanges()
    document.getElementById('razorpay-response').style.display = 'block';
  }


  updatePaymentStatus(orderNo, razorpayPaymentId){
    this.showModal = false;
               document.getElementById('razorpay-response').style.display = 'none';
    this.subscriptionService.updatePaymentStatus(orderNo, razorpayPaymentId).subscribe( response => {
        
      console.log(response);

       if(response['status'] == true){
               this.makeMrn();
               

       }
  });
  }


  makeMrn(){
    this.subscriptionService.mkeMrn().subscribe( response => {
        
      console.log(response);
      // this.router.navigate(['/home']);
      // window.location.href='/home';
          location.reload();
          // this.router.navigate(['/home']);
  });
  }


  getNotifications() {
    this.notifyService.getNotifications().subscribe( response => {
        console.log(response);
        // console.log(response.data);  
        
        sessionStorage.setItem('doctor_id',response.data[0].doctor_id);

                   
    },
        error => {
          //   this.alertNotSuccess();
            
        } );

} 



showAddModal() {
  this.sigdisplay = 'block';
}

hideAddModal(): void {
  this.sigdisplay = 'none';
}

}
