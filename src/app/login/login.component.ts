import { Component, OnInit } from '@angular/core';
import { HttpService } from '../services/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import appConstants from '../config/app.constants';
import { AuthService } from "../auth.service";
import { InviteSubscriberService } from '../services/inviteSuscriber.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';


// import { MessagingService } from "../messaging.service";   

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
message;
  constructor(private httpService: HttpService, 
              private formBuilder: FormBuilder, 
              private router: Router, private http:HttpClient,
              private inviteSubscriberService: InviteSubscriberService,
              // private msgService: MessagingService, 
              private authService: AuthService) { }
  loginForm: FormGroup;
  emailLabel = false;
  passLabel = false;
  lognRes: any;

  ngOnInit() {
    // this.apiTest();
    document.querySelector('body').classList.add('body-bg-color-theme');
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
     });

    //  this.msgService.getPermission();
    //  this.msgService.receiveMessage();
    // this.message = this.msgService.currentMessage;
    
  }
  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }
  
  login(){
    this.httpService.commonPost(appConstants.apiBaseUrl + 'login',this.loginForm.value).subscribe((res:Response) =>{
      console.log(res, "User Sucessfully Logged in!.");
      this.lognRes = res;
      this.authService.setLoginDetails(this.lognRes.data)
      // this.router.navigate([appConstants.routingList.HOME_COMPONENT]);
      // if (this.lognRes.data.category_name === appConstants.userType.SUBSCRIBER) {
      //   this.router.navigate([appConstants.routingList.SUBSCRIBER_COMPONENT]);
      // }
      // if (this.lognRes.data.category_name === appConstants.userType.DOCTOR) {
      //   this.router.navigate([appConstants.routingList.DOCTOR_COMPONENT]);
      // }
      /*console.log(this.lognRes.data.category_name);
      console.log(appConstants.userType.DOCTOR);
      if (this.lognRes.data.category_name == appConstants.userType.DOCTOR) {
      
        this.inviteSubscriberService.getDoctorData().subscribe(disList => {
          console.log(disList); 
          console.log(disList['data']);
          if(disList['data'].length > 0){
            this.router.navigate(['/doctor/profile']);
          }  
          
        });
        } else {
           this.router.navigate([appConstants.routingList.HOME_COMPONENT]);

        }*/
        console.log(this.lognRes.data.category_name);
        if(this.lognRes.data.category_name === appConstants.userType.SUBSCRIBER || this.lognRes.data.category_name === appConstants.userType.DOCTOR){
          this.router.navigate([appConstants.routingList.HOME_COMPONENT]);
        } else {
          this.router.navigate(['/health-data']);
        }

    })
  }
  
  signup(){
    this.router.navigate([appConstants.routingList.SIGNUP_COMPONENT]);
  }
  
  ngOnDestroy(): void {
    document.querySelector('body').classList.remove('body-bg-color-theme');
  }


  apiTest(){
    let headers = new Headers();
      headers.append('Content-Type','application/json');
      headers.append('Accept', 'application/json');
      headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT');
      headers.append('Access-Control-Allow-Origin', '*');
      headers.append('Access-Control-Allow-Headers', "X-Requested-With, Content-Type, Origin, Authorization, Accept, Client-Security-Token, Accept-Encoding");
      // let options = new RequestOptions({ headers: headers });
      let options = { headers: headers };
      console.log(options)
      // let body = "username="+this.loginForm.value.email+"&password="+this.loginForm.value.password;
      let body = "http://127.0.0.1:5424/prediction?row_no=2&hh=30&f=365";
      console.log(body);
    this.http.post(body,
    options).
      subscribe((data) => {
        console.log(data);
  
  
      });
  }

}
