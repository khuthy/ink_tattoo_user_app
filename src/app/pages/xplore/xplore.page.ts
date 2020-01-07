import { NotificationsPage } from './../../notifications/notifications.page';
import { SignInPage } from './../../pages/sign-in/sign-in.page';
import { BookingModalPage } from './../../booking-modal/booking-modal.page';
import { DeliverDataService } from './../../deliver-data.service';
import { RegisterPage } from './../../pages/register/register.page';
import { Component, OnInit, Renderer2 } from '@angular/core';
import * as firebase from 'firebase';
import { ModalController, AlertController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-xplore',
  templateUrl: './xplore.page.html',
  styleUrls: ['./xplore.page.scss'],
})
export class XplorePage implements OnInit {


/* Animations */
popoverState = false;
popoverDiv = document.getElementsByClassName('popOver');

datesState = false;
dateIcon = 'ios-arrow-down';
dateDiv = document.getElementsByClassName('dates');

tattooInfo = false;
tattooDiv = document.getElementsByClassName('info-tattoo');

menu = false;
menuDiv = document.getElementsByClassName('wraper-list');
  
tattoo = {
    name: '',
    pricerange: '',
    description: '',
    image: '',
    categories:''
    
  }
  db = firebase.firestore();
  Tattoos = [];
  MyValue: boolean;
  MyValue1: boolean;
  num: number;
  docId: string;
  query: any[];
  Design = [];
  Sketch = [];
  PreviouseWork = [];
  porpular = []
  respnses = []
  AcceptedData = [];

  ShowName=[];

  name = "";

  email: string;
 

  showProfile1;

  constructor(public DeliverDataService : DeliverDataService, public modalController: ModalController, public alertCtrl: AlertController, private render: Renderer2, private rout:Router) {

    this.respnses = this.DeliverDataService.AcceptedData;
   
   

 

   }



   async Notifications(){
     console.log("ttttttttt", this.respnses);
    let modal = await this.modalController.create({
       component : NotificationsPage,
       cssClass: 'modalNotification'
     })
     return await modal.present();
   }

   load(){

    if(firebase.auth().currentUser){

      this.db.collection("Bookings").doc(firebase.auth().currentUser.uid).collection("Requests").get().then(i => {
        i.forEach(a => {
  
         if(a.data().bookingState === "Accepted"){
              
          this.db.collection("Bookings").doc(firebase.auth().currentUser.uid).collection("Response").get().then(myItem => {       
            myItem.forEach(doc => {
              if(doc.data().bookingState === "Pending"){
                this.AcceptedData.push(doc.data())
                console.log("@@@@@@@@@", this.AcceptedData);
              }   
            })
        
      })
      
         }
        
        })
      })
    }

   }

 

   ionViewWillEnter(){

    this.name = this.DeliverDataService.name;

           //User's details
           this.email=firebase.auth().currentUser.email;

          
   
           this.db.collection("Bookings").onSnapshot(data => {         
             data.forEach(item => {
               if(item.exists){
  
                this.ShowName=[];
                 if(item.data().email === this.email){
                   this.DeliverDataService.name = item.data().name;
                   this.name = item.data().name
                   this.ShowName.push(item.data());
                   console.log("ShowName",item.data().name);
                 }
               }
             })
           })
         
 
  
    this.showProfile();



  }




  
  showProfile(){
    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        this.showProfile1 = true;
      }else {
        this.showProfile1 = false;
      }
    })
   }
 

    profile(){
      this.rout.navigateByUrl('/profile')

    }

  ngOnInit() {

    this.showProfile();



   

    
    

    
    this.db.collection("Tattoo").onSnapshot(data => {
      data.forEach(item => {
        if(item.exists){
          if(item.data().categories === "Sketch/design"){
            
           this.Sketch.push(item.data());
          //  console.log("11111111111111111",this.Sketch);
          }
        }
      })
    })
    this.db.collection("Tattoo").onSnapshot(data => {
      data.forEach(item => {
        if(item.exists){
          if(item.data().categories === "Previous work"){
            
           this.PreviouseWork.push(item.data());
         
          }
        }
      })
    })
    this.db.collection("Tattoo").onSnapshot(data => {
      data.forEach(item => {
        if(item.exists){
          if(item.data().categories === "Sketch/design"){
            
           this.porpular.push(item.data());
       
          }
        }
      })
    })
            
}



async CreateAccount(){
  let modal = await this.modalController.create({
    component : RegisterPage
  })
  this.showProfile();
  return await modal.present();
}
async Login(){

 
 

    let modal = await this.modalController.create({
      component : SignInPage,
    })
    
    this.showProfile();
    return await modal.present();
  



}
logOut(){

  this.ShowName=[];
  firebase.auth().signOut().then(user => {
    
    console.log("Logged out successfully");

  }).catch(error => {
    console.log("Something went wrong");
    
  })

 
}
 async Booking(tattoo){
    if(firebase.auth().currentUser){

      this.showProfile1 = true;
      console.log("Your data ", tattoo);
      console.log("Your uid here is ", firebase.auth().currentUser.uid);
      console.log("Your email here is ", firebase.auth().currentUser.email);
      // this.db.collection("Bookings").doc(firebase.auth().currentUser.uid).collection("Requests").doc().set({

        this.ShowName.push(firebase.auth().currentUser.email);
        console.log("display name ", this.ShowName);
      //   name : "Simon",
      //   surname : "Cowel",
      //   legnth : "153",
      //   breadth : "353"
      // })
      this.DeliverDataService.dataSaved.category = tattoo.categories;
      this.DeliverDataService.dataSaved.description = tattoo.description;
      this.DeliverDataService.dataSaved.image = tattoo.image;
      this.DeliverDataService.dataSaved.name = tattoo.name;
      this.DeliverDataService.dataSaved.priceRange = tattoo.pricerange;


   

      console.log("Your data in the service",  this.DeliverDataService.dataSaved);
      const modal = await this.modalController.create({
        component: BookingModalPage
      });
      return await  modal.present();
    }else{
      console.log("Sorry no user here");
      const modal = await this.modalController.create({
        component: RegisterPage
      });
      return await  modal.present();
      
    }
    
  }

  // viewNotifications() {
    
  //   this.animate(); 
    
  // }

  // animate() {
  //   this.popoverState = !this.popoverState
  //   if (this.popoverState) {
  //     this.render.setStyle(this.popoverDiv[0],'display','block');
  //   } else {
  //     setTimeout(() => {
  //      this.render.setStyle(this.popoverDiv[0],'display','none');
  //     }, 500);
  //   }
    
  // }
  // animateDates() {
  //   this.datesState = !this.datesState
  //   if (this.datesState) {
  //     this.dateIcon = 'ios-arrow-up';
  //     this.render.setStyle(this.dateDiv[0],'display','block');
  //   } else {
  //     setTimeout(() => {
  //       this.dateIcon = 'ios-arrow-down';
  //      this.render.setStyle(this.dateDiv[0],'display','none');
  //     }, 500);
  //   }
    
  // }
  // tattooShowInfoAnimate(){
  //   this.tattooInfo = !this.tattooInfo
  //   if (this.tattooInfo) {
     
  //     this.render.setStyle(this.tattooDiv[0],'display','block');
  //   } else {
  //     setTimeout(() => {
  //      this.render.setStyle(this.tattooDiv[0],'display','none');
  //     }, 500);
  //   }
  // }

  addClasseAnimate() {
    this.menu = !this.menu
    if (this.menu) {
     
       this.render.setStyle(this.menuDiv[0],'display','flex'); 
      this.render.addClass(this.menuDiv[0],'dropped');
    } else {
      setTimeout(() => {
       this.render.setStyle(this.menuDiv[0],'display','none');
       this.render.removeClass(this.menuDiv[0],'dropped');
       
      }, 500);
    }
  }


  pb(){
  }
  obj = {id: null, obj : null}




}





