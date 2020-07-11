import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../services/http.service';
import { AuthService } from '../auth.service';
import { DataService } from "../services/data.service";
import { MyHealthReportService } from '../services/my-health-report.service';

@Component({
  selector: 'app-my-health-report',
  templateUrl: './my-health-report.component.html',
  styleUrls: ['./my-health-report.component.css']
})
export class MyHealthReportComponent implements OnInit {
 constructor(private httpService: HttpService, private formBuilder: FormBuilder, 
             public auth: AuthService, private data : DataService,
             private healthReportService: MyHealthReportService) { }
  httpdata;
  user_id: string;
  isViewOnly = false;
  finalData;
  yearList = [];
  isQuarterlyReport = false;
  isInitialReport = false;
  isProgressReport = false;
  isYearlyReport = false;
  initialReportInputForm: FormGroup;
  quartelyReportInputForm: FormGroup;
  progressReportInputForm: FormGroup;
  yearlyReportInputForm: FormGroup;
  quarterList;

  // listYear = [1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
  
  ngOnInit() {
    
    if (this.auth.isSubscriber()) {//====== if Subascriber Take user_id from session.=====
      this.user_id = JSON.parse(sessionStorage.getItem('userdata')).user_id;
      this.isViewOnly = true;
    } else if (this.auth.isDoctor()) {
      this.data.getSubscriberId.subscribe(subscriber_id => this.user_id = subscriber_id);
    }
  // initialReportForm: FormGroup;
  this.initialReportInputForm = this.formBuilder.group({
      subscriber_id: ['', [Validators.required]]
     });
    //====== set user_id by default if subscriber logged in  ====/
    let set_user_id = this.auth.isDoctor() ? '' : this.user_id;

     this.quartelyReportInputForm = this.formBuilder.group({
      user_id: [set_user_id, [Validators.required]],
      year: ['', [Validators.required]],
      quarter: ['', [Validators.required]]
     });

     this.yearlyReportInputForm = this.formBuilder.group({
      user_id: [set_user_id, [Validators.required]],
      year: ['', [Validators.required]]
     });

    // progressReportForm: FormGroup;
    this.progressReportInputForm = this.formBuilder.group({
      user_id: ['', [Validators.required]]
   });

     this.quarterList = [1,2,3,4];
     this.getYearList();
  }

   // convenience getter for easy access to form fields
   get f() { return this.initialReportInputForm.controls; }
   submit(){
    //  console.log(this.initialReportInputForm.value.subscriber_id);
    this.data.setSubscriberId(this.initialReportInputForm.value.subscriber_id);
     //this.router.navigate([appConstants.routingList.MyHealthReportListComponent]);
    // this.healthReportService.loadInitialHealthReportData(this.initialReportInputForm.value.subscriber_id);
    setTimeout(()=>{
      this.healthReportService.user_id_emitter.emit(this.initialReportInputForm.value.subscriber_id);
    }, 0);
    this.isQuarterlyReport = false;
    this.isInitialReport = true;
    this.isProgressReport = false;
   }

  getYearList() {
    let year = new Date().getFullYear();
    // console.log(year);
    
    this.yearList = [];
    for (var i = 0; i < 3; i++) {
      this.yearList.push(year - i);
    }
    // console.log(this.yearList);
    
  }

  subscriberInitialReport(){
    this.isQuarterlyReport = false;
    this.isInitialReport = true;
    this.isProgressReport = false;
    this.isYearlyReport = false;
    setTimeout(()=>{
      this.healthReportService.user_id_emitter.emit(this.user_id);
    }, 0);
  }

  subscriberYearlyReport(){
    this.isQuarterlyReport = false;
    this.isInitialReport = false;
    this.isProgressReport = false;
    this.isYearlyReport = true;
  }

  // convenience getter for easy access to form fields
  get qf() { return this.quartelyReportInputForm.controls; }
  quartelyReportInputSubmit(){
    // console.log(this.quartelyReportInputForm.value);
    this.data.setQuartelyReport(this.quartelyReportInputForm.value);
    setTimeout(()=>{
      this.healthReportService.user_id_emitter.emit(this.quartelyReportInputForm.value);
    }, 0);

    this.isQuarterlyReport = true;
    this.isInitialReport = false;
    this.isProgressReport = false;
  }

  yearlyReportInputSubmit(){
    console.log(this.yearlyReportInputForm.value);
    this.data.setYearlyReport(this.yearlyReportInputForm.value);
    setTimeout(()=>{
      this.healthReportService.user_id_emitter.emit(this.yearlyReportInputForm.value);
    }, 0);

    this.isQuarterlyReport = false;
    this.isInitialReport = false;
    this.isProgressReport = false;
    this.isYearlyReport = true;

  }

  // convenience getter for easy access to form fields
  get pf() { return this.progressReportInputForm.controls; }
  progressReportInputSubmit(){
    // console.log(this.progressReportInputForm.value);
    this.isQuarterlyReport = false;
    this.isInitialReport = false;
    this.isProgressReport = true;
    this.isYearlyReport = false;
    this.data.setSubscriberId(this.progressReportInputForm.value.user_id);
    setTimeout(()=>{
      this.healthReportService.user_id_emitter.emit(this.progressReportInputForm.value.user_id);
    }, 0);
  }

  subscriberProgressReport(){
    this.isQuarterlyReport = false;
    this.isInitialReport = false;
    this.isYearlyReport = false;
    this.isProgressReport = true;
    setTimeout(()=>{
      this.healthReportService.user_id_emitter.emit(this.user_id);
    }, 0);
  }
  ngOnDestroy(): void {
    
  }

}
