import { Component, OnInit, ViewChild  } from '@angular/core';
import { HttpService } from '../services/http.service';
import { FormGroup, FormArray, FormBuilder, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import appConstants from '../config/app.constants'
import { AuthService } from "../auth.service";
import { DataService } from "../services/data.service";
import { NotifyService } from '../services/notify.service';

import { MessagingService } from "../messaging.service";
import { InviteSubscriberService } from "../services/inviteSuscriber.service";
import { UtilService } from '../services/util.service';
import { sha256 } from 'js-sha256';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import swal from 'sweetalert2';



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
    profileFlag: Boolean = false;
    subscriptionFlag: Boolean = false; 
    drInfoFlag: Boolean = false;

  constructor(private httpService: HttpService, dialogService: DialogService,
              private data: DataService, private utilService: UtilService,
              private inviteSubscriberService: InviteSubscriberService, 
              private formBuilder: FormBuilder,  private notifyService: NotifyService,
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
    this.message = this.msgService.currentMessage;
    // this.updateFcmTokn();
    // this.inviteSubscriberService.updateAddFcmToken();

    
    this.medicalSummaryInputForm = this.formBuilder.group({
      subscriber_id: ['', [Validators.required]]
    });
    this.doctorRequest = this.formBuilder.group({
      pin: ['', [Validators.required]]
  });
    if(JSON.parse(sessionStorage.getItem("userdata")).category_name == "Doctor")
  {
    this.restrictDoctor();
    } else if(JSON.parse(sessionStorage.getItem("userdata")).category_name == "Subscriber"){
      this.getMyAccount();
      this.getNotifications();
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
    
    // this.msgService.updateUserFcmToken();
 
  }
  
  // convenience getter for easy access to form fields
  get f() { return this.medicalSummaryInputForm.controls; }
  submit() {
    this.data.setSubscriberId(this.medicalSummaryInputForm.value.subscriber_id);
    this.router.navigate([appConstants.routingList.DOCTOR_MEDICAL_SUMMARY_COMPONENT]);
  }
/*
  getUserProfile() {
    return this.httpService.commonPost(appConstants.apiBaseUrl + 'get_subscriber_details', { user_id: this.auth.getUserId() });
  }
*/
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

 /* restrictSubscriber(){
 
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
  }*/

 


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


getMyAccount(){
  this.httpService.commonPost(appConstants.apiBaseUrl + 'get_subscriber_details',
   { user_id: JSON.parse(sessionStorage.getItem("userdata")).user_id  }).subscribe(response => {
    console.log(response);
    if(response.data.length > 0){
         this.profileFlag = true;
         console.log(response.data[0].mrn);
         console.log(response.data[0].doctor_id);
         
         if(response.data[0].doctor_id == ""){
              this.subscriptionFlag = true;
         } else {
          this.subscriptionFlag = false;
         }
         console.log(this.subscriptionFlag);
         
    } else {
      this.profileFlag = false;
    }
  });
}


goToSubscriptionAccountPage(){
  swal.fire(
    'Success',
    'Your Subscription is Pending',
    'success'
  ).then(() => {
    this.router.navigate(["subscription-account"]);
  });
}

/*getSubscriberDetails() {
  return this.httpService.commonPost(appConstants.apiBaseUrl + 'get_subscriber_details', { 
    user_id: JSON.parse(sessionStorage.getItem("userdata")).user_id 
   });
}*/


getNotifications() {
  this.notifyService.getNotifications().subscribe( response => {
      console.log(response);
      // console.log(response.data);  
      if(response.data.length > 0){
          this.drInfoFlag = false;
      } else {
        this.drInfoFlag = true;
      }

                 
  },
      error => {
        //   this.alertNotSuccess();
          
      } );

} 

restrictSubscriber(tile){
  console.log(tile);
  console.log(this.profileFlag);
  console.log(this.subscriptionFlag);
  console.log(this.drInfoFlag);
  
    if(this.profileFlag == true){
           if(this.drInfoFlag == true){
            // let message = 'Your Subscription is Pending';
            let message = "Please wait for Doctor's Invitation";
            this.toastrService.success(message);
           } else if(this.subscriptionFlag == true){
                  this.goToSubscriptionAccountPage();
           }else {
            switch (tile) {
              case '1':
                 this.router.navigate(['health-report']);
              break;
              case '2':      
                 this.router.navigate(['subscriber/medical-summary']);
              break;
              case '3':      
                 this.router.navigate(['health-data']);
              break;
              case '4':      
                 this.router.navigate(['subscriber-appointment']);
              break;
              case '5':      
                 this.router.navigate(['subscription-account']);
              break;
              case '6':      
                this.router.navigate(['whatsnew']);
              break;
              case '7':      
              this.router.navigate(['healthInfoBits']);
            break;
              default:
            }
           }
    } else {
      this.router.navigate(['subscriber/profile']);
    }
}

}
