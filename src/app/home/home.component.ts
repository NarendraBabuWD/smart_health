import { Component, OnInit, ViewChild  } from '@angular/core';
import { HttpService } from '../services/http.service';
import { FormGroup, FormArray, FormBuilder, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import appConstants from '../config/app.constants'
import { AuthService } from "../auth.service";
import { DataService } from "../services/data.service";
import { MessagingService } from "../messaging.service";
import { InviteSubscriberService } from "../services/inviteSuscriber.service";
import { UtilService } from '../services/util.service';
import { sha256 } from 'js-sha256';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public doctorRequest: FormGroup;
  @ViewChild('alertModal', {static: false}) alertModal: ModalDirective;
    message;
    isModalShown = false;
    showModal: boolean;
    pincheck = false;
    showSubModal: boolean;
  constructor(private httpService: HttpService, dialogService: DialogService,
              private data: DataService, private utilService: UtilService,
              private inviteSubscriberService: InviteSubscriberService, 
              private formBuilder: FormBuilder, 
              private msgService: MessagingService, 
              private router: Router, public auth: AuthService,
              private toastrService: ToastrService) { 
                
              }
  medicalSummaryInputForm: FormGroup;
  subscriberProfileRes;
  ngOnInit() {
    // this.restrictDoctor();
    this.showSubModal = false;
    // this.getClaimStatus();
    

    this.msgService.getPermission();
    this.msgService.receiveMessage();
    // this.message = this.msgService.currentMessage;
    // this.updateFcmTokn();
    this.medicalSummaryInputForm = this.formBuilder.group({
      subscriber_id: ['', [Validators.required]]
    });
    this.doctorRequest = this.formBuilder.group({
      pin: ['', [Validators.required]]
  });
    if(JSON.parse(sessionStorage.getItem("userdata")).category_name == "Doctor")
  {
    this.restrictDoctor();
    }
    
    
    //======== after user is logged in if subscriber get Doctor id.
    /*if (this.auth.isSubscriber() && !this.auth.getDoctorId()) {
      this.getUserProfile().subscribe((resp) => {
        const subscriberProfileRes = resp;
        if (subscriberProfileRes.status) {
          const { doctor_id } = subscriberProfileRes.data[0];
          const userData = JSON.parse(this.auth.getLoginDetails());
          userData["doctor_id"] = parseInt(doctor_id);
          this.auth.setLoginDetails(userData);
        }
      });
    }*/
    /*setTimeout(function(){
      console.log(JSON.parse(sessionStorage.getItem("userdata")).user_id);
      console.log(sessionStorage.getItem("fcm_token"));
    },1500);*/
    
    this.msgService.updateUserFcmToken();
 
  }
  
  // convenience getter for easy access to form fields
  get f() { return this.medicalSummaryInputForm.controls; }
  submit() {
    this.data.setSubscriberId(this.medicalSummaryInputForm.value.subscriber_id);
    this.router.navigate([appConstants.routingList.DOCTOR_MEDICAL_SUMMARY_COMPONENT]);
  }

  getUserProfile() {
    return this.httpService.commonPost(appConstants.apiBaseUrl + 'get_subscriber_details', { user_id: this.auth.getUserId() });
  }

  updateFcmTokn() {
    //  setTimeout(function(){
    //   console.log(sessionStorage.getItem("fcm_token"));
    // },1500);

    console.log("FCM CALLED");
    
    return this.httpService.commonPost(appConstants.apiBaseUrl + 'update_user_fcm_token', { 
      user_id: JSON.parse(sessionStorage.getItem("userdata")).user_id,
      fcm_token: sessionStorage.getItem("fcm_token") 
     });
   }

  /*getFcmToken(){
    console.log(JSON.parse(sessionStorage.getItem("userdata")).user_id);
    console.log(sessionStorage.getItem("fcm_token"));
  }*/

  restrictSubscriber(){
 
if(JSON.parse(sessionStorage.getItem("userdata")).doctor_id == ''){
  this.utilService.toastrInfo("Please Wait For Doctor's Invitation", "Subscriber");
} else if(JSON.parse(sessionStorage.getItem("userdata")).doctor_id != ''){
  this.getSubscriberDetails().subscribe((response) => {
    // console.log(response);
    if(response.data.length < 0){
      this.utilService.toastrInfo("Please Fill Profile Page", "Subscriber");
 } else {
  this.router.navigate(['/health-report']);
 }
  });
}
    // this.router.navigate(['/health-report']) 
  }

  getSubscriberDetails() {
    return this.httpService.commonPost(appConstants.apiBaseUrl + 'get_subscriber_details', { 
      user_id: JSON.parse(sessionStorage.getItem("userdata")).user_id 
     });
  }


  restrictDoctor(){
    this.inviteSubscriberService.getDoctorData().subscribe(disList => {
      console.log(disList); 
      console.log(disList['data']);
      if(disList['data'].length > 0){
        // this.router.navigate(['/doctor/profile']);
        // this.checkEmpanelment();
      } else{
        this.router.navigate(['/doctor/profile']);
      }
    });

   

    /*this.inviteSubscriberService.getEmpanelementStatus().subscribe(response => {
    
     console.log(response);
      console.log(response['data']);
      console.log(response['data'][0].status);
     if(response['data'].length > 0 && response['data'][0].status == '1'){
      this.router.navigate(['claim-submission']);
     }else if(response['data'].length > 0 && response['data'][0].status == '0'){
      let message = 'Your Empanelment is Pending';
      this.toastrService.success(message); 
     } else if(response['data'].length > 0 && response['data'][0].status == '2'){
      let message = 'Your Empanelment is Rejected';
      this.toastrService.success(message); 
     }else{
      let message = 'kindly Add Empanelment';
      this.toastrService.success(message); 
     }
  
    });*/
    // this.router.navigate(['']);
  }

  checkEmpanelment(){
    this.inviteSubscriberService.getEmpanelementStatus().subscribe(response => {
    
      /*console.log(response);
       console.log(response['data']);
       console.log(response['data'][0].status);*/
      if(response['data'].length > 0 && response['data'][0].status == '1'){
       this.router.navigate(['claim-submission']);
      }else if(response['data'].length > 0 && response['data'][0].status == '0'){
       let message = 'Your Empanelment is Pending';
       this.toastrService.success(message); 
      } else if(response['data'].length > 0 && response['data'][0].status == '2'){
       let message = 'Your Empanelment is Rejected';
       this.toastrService.success(message); 
      }else{
       let message = 'kindly Add Empanelment';
       this.toastrService.success(message); 
       this.router.navigate(['empanelment-form']);
      }
   
     });
  }

  medicalSummaryInputFormModel(){
    this.inviteSubscriberService.getEmpanelementStatus().subscribe(response => {
    
      if(response['data'].length > 0 && response['data'][0].status == '1'){
      this.showSubModel();
      }else if(response['data'].length > 0 && response['data'][0].status == '0'){
       let message = 'Your Empanelment is Pending';
       this.toastrService.success(message); 
      } else if(response['data'].length > 0 && response['data'][0].status == '2'){
       let message = 'Your Empanelment is Rejected';
       this.toastrService.success(message); 
      }else{
       let message = 'kindly Add Empanelment';
       this.toastrService.success(message); 
       this.router.navigate(['empanelment-form']);
      }
   
     });
  }

  show()
{
  this.showModal = true; // Show-Hide Modal Check
}
//Bootstrap Modal Close event
hide()
{
  this.showModal = false;
}

showSubModel()
{
  this.showSubModal = true; // Show-Hide Modal Check
}
subModalClose(){
  this.showSubModal = false; 
}
onSubmit( model: FormGroup ) {
  this.inviteSubscriberService.doctorAgree( model.value ).subscribe( response => {
      let message = 'Doctor Requested Successfully';
      this.toastrService.success(message);                  
  },
      error => {
        //   this.alertNotSuccess();
          
      } );

} 

doctorDisAgree() {
  this.inviteSubscriberService.doctorDisAgree().subscribe( response => {
      let message = 'Doctor Requested Disagreed';
      this.toastrService.success(message);                  
  },
      error => {
        //   this.alertNotSuccess();
          
      } );

} 
/*
getClaimStatus() {
  this.inviteSubscriberService.getClaimStatus().subscribe( status => {
     console.log(status['data'][0].status);  
     if(status['data'].length > 0 && status['data'][0].status == 0){
      this.show();
      this.isModalShown = true;
     }                
  },
      error => {
        //   this.alertNotSuccess();
          
      } );

} */

}
