import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HttpService } from './services/http.service';
import { DataService } from './services/data.service';
import { UtilService } from './services/util.service';
import { AuthService } from "./auth.service";
import { AuthGuard } from "./auth.guard";
import { AbsPipe } from "./abs.pipe";
import { BootstrapModalModule } from 'ng2-bootstrap-modal';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { DoctorComponent } from './doctor/doctor.component';
import { MedicalSummaryComponent } from './subscriber/medical-summary/medical-summary.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MyHealthDataComponent } from './my-health-data/my-health-data.component';
import { FilterComponent } from './components/filter/filter.component';
import { MyHealthDataService } from './services/my-health-data.service';
import { MultiLineComponent } from './charts/multi-line/multi-line.component';
import { InitialReportComponent } from './initial-report/initial-report.component';
import { MyHealthReportComponent } from './my-health-report/my-health-report.component';
import { QuarterlyReportComponent } from './quarterly-report/quarterly-report.component';
import { ProgressReportComponent } from './progress-report/progress-report.component';
import { MyHealthReportService } from './services/my-health-report.service';
import { DialogComponent } from './components/dialog/dialog.component';
import { EmpanelmentFormComponent } from './empanelment-form/empanelment-form.component';
import { ClaimSubmittionComponent } from './claim-submittion/claim-submittion.component';
import { ClaimHistoryComponent } from './claim-history/claim-history.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { SubscriberProfileComponent } from './subscriber/subscriber-profile/subscriber-profile.component';
import { DoctorProfileComponent } from './doctor/doctor-profile/doctor-profile.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { LoaderInterceptor } from './services/loader.interceptors';
import { InviteSubscriberComponent } from './invite-subscriber/invite-subscriber.component';
import { MessagingService } from "./messaging.service";
import { AngularFireModule } from "angularfire2";
// for AngularFireDatabase
import { AngularFireDatabaseModule } from "angularfire2/database";
import { AngularFireDatabase } from "angularfire2/database";
// for AngularFireAuth
import { AngularFireAuthModule } from "angularfire2/auth";
import { AngularFireAuth } from "angularfire2/auth";
import { RequestPatientsComponent  } from './request-patients/request-patients.component';
import { HelpSupportComponent } from './help-support/help-support.component';
import { SettingsComponent } from './settings/settings.component';
import { DoctorAppointmentComponent } from './doctor-appointment/doctor-appointment.component';
import { SubscriberAppointmentComponent } from './subscriber-appointment/subscriber-appointment.component';
// import { AmazingTimePickerModule } from 'amazing-time-picker'; // this line you need
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { FeedbackComponent } from './feedback/feedback.component';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { WhatsNewComponent } from './whats-new/whats-new.component';
import { HealthInfoBitsComponent } from './health-info-bits/health-info-bits.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { YearlyReportComponent } from './yearly-report/yearly-report.component';
import { SubscriptionAccountComponent } from './subscription-account/subscription-account.component';
import { SubscriptionOrderComponent } from './subscription-order/subscription-order.component';
import { TimepickerModule } from 'ngx-bootstrap';



// export const firebaseConfig = {
//   apiKey: "AIzaSyBseozGbWiVjfBvFuNFFIH1Jd9iBqnQiBw",
//   authDomain: "healthcare-66586.firebaseapp.com",
//   databaseURL: "https://healthcare-66586.firebaseio.com",
//   projectId: "healthcare-66586",
//   storageBucket: "healthcare-66586.appspot.com",
//   messagingSenderId: "2503572817",
//   appId: "1:2503572817:web:783ac195881c47708f6770",
//   measurementId: "G-J30X7SC7GX"
// };

export const firebaseConfig = {
  apiKey: "AIzaSyANdqFEeZKsIUgO-3iDfINBxWob4Yd1qmw",
  authDomain: "healthproject-aab8a.firebaseapp.com",
  databaseURL: "https://healthproject-aab8a.firebaseio.com",
  projectId: "healthproject-aab8a",
  storageBucket: "healthproject-aab8a.appspot.com",
  messagingSenderId: "876317979293",
  appId: "1:876317979293:web:a539f8155901f2205e1a74",
  measurementId: "G-2QTYGEMM9X"
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    DoctorComponent,
    MedicalSummaryComponent,
    EmpanelmentFormComponent,
    ClaimSubmittionComponent,
    ClaimHistoryComponent,
    RequestPatientsComponent,
    HeaderComponent,
    HomeComponent,
    SidebarComponent,
    FilterComponent,
    MyHealthDataComponent,
    MultiLineComponent,
    InitialReportComponent,
    MyHealthReportComponent,
    QuarterlyReportComponent,
    ProgressReportComponent,
    DialogComponent,
    SubscriberProfileComponent,
    DoctorProfileComponent,
    SpinnerComponent,
    InviteSubscriberComponent,
    HelpSupportComponent,
    SettingsComponent,
    DoctorAppointmentComponent,
    SubscriberAppointmentComponent,
    FeedbackComponent,
    AnnouncementsComponent,
    WhatsNewComponent,
    HealthInfoBitsComponent,
    NotificationsComponent,
    PrivacyPolicyComponent,
    YearlyReportComponent,
    AbsPipe,
    SubscriptionAccountComponent,
    SubscriptionOrderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
    // AmazingTimePickerModule,
    BsDatepickerModule.forRoot(),
    AppRoutingModule,
    ModalModule.forRoot(),
    TimepickerModule.forRoot(),
    InfiniteScrollModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    BootstrapModalModule,
    PdfViewerModule
  ],
// exports:[DialogComponent],
  entryComponents:[DialogComponent],
  providers: [ AuthGuard, AuthService,  HttpService, DataService, UtilService, MyHealthDataService, MyHealthReportService, {provide: LocationStrategy, useClass: HashLocationStrategy},{ provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }],

  bootstrap: [AppComponent]
})
export class AppModule { }
