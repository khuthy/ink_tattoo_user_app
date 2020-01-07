import { RegisterPage } from './../register/register.page';
// import { XplorePage } from './../pages/xplore/xplore.page';
import { DeliverDataService } from '../../deliver-data.service';

import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import * as firebase from "firebase";
import { Router } from '@angular/router';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';






@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {

  db = firebase.firestore();
  counter : number = 0;
  email = "";
  password = "";
  AcceptedData = [];

  showProfileState: boolean
  tattooForm : FormGroup;
  validation_messages = {
  
    'email': [
      {type: 'required', message: 'Email address is required.'},
      {type: 'pattern', message: 'Email address is not Valid.'},
      {type: 'validEmail', message: 'Email address already exists in the system.'},
    ],
    'password': [
      {type: 'required', message: 'Password is required.'},
      {type: 'maxlength', message: 'password must be atleast 6 char'},
    ]

  }
  constructor(public modalController : ModalController, private fb: FormBuilder,public Router : Router,  public DeliverDataService : DeliverDataService) { }

  ngOnInit() {
    this.showProfile();
    this.tattooForm = this.fb.group({
      email: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-.]+$')])),
     password: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(6)]))
    })
  }
  
  


  login(tattooForm){


    if (this.tattooForm.valid ) {
   firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(() => {

    console.log("=========================");
    if(firebase.auth().currentUser){

      this.db.collection("Bookings").doc(firebase.auth().currentUser.uid).collection("Requests").get().then(i => {
        i.forEach(a => {

         if(a.data().bookingState === "Accepted"){   
          this.db.collection("Bookings").doc(firebase.auth().currentUser.uid).collection("Response").get().then(myItem => {       
            myItem.forEach(doc => {
              if(doc.data().bookingState === "Pending"){
                this.DeliverDataService.AcceptedData = [];
                this.DeliverDataService.AcceptedData.push(doc.data())
                // console.log("@@@@@@@@@", this.DeliverDataService.AcceptedData);
              }   
            })
          
      })
      // return true; 
         }
        
        })
      })
    }


    this.db.collection("Bookings").doc(firebase.auth().currentUser.uid).get().then(data => {
      console.log("qqqqqqqqqqqqqq ", data.data().name);
      this.DeliverDataService.name = data.data().name;
      
    })
  

    this.Router.navigateByUrl('/xplore')

   }).catch(error => {

    this.modalController.dismiss({
      'dismissed': true
    });

   })

   this.modalController.dismiss({
    'dismissed': true
  });

    }


  }

  
  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }
  showProfile(){
    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        this.showProfileState = true;
      }else {
        this.showProfileState = false;
      }
    })
   }
 

  async CreateAccount(){

    let modal = await this.modalController.create({
      component : RegisterPage
    })
    
    return await modal.present();
  }
  
}
