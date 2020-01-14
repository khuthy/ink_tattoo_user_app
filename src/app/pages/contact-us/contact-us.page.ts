import { RegisterPage } from './../register/register.page';
import { NotificationsPage } from './../../notifications/notifications.page';
import { Component, OnInit, Renderer2 } from '@angular/core';
import * as firebase from 'firebase';
import { ModalController, ToastController } from '@ionic/angular';
import { SignInPage } from '../sign-in/sign-in.page';
@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage implements OnInit {
  Contact = [];
  db = firebase.firestore();
  split: boolean = false;
  MyNotifications: number = 0;
  email: string;
  tattooView: any;
  splitDiv: any = document.getElementsByClassName('split-pane');
  loader: boolean = true;
  showProfile1: boolean;
  contactUs: boolean = true;
  contactUsDiv = document.getElementsByClassName('contact-information');
  icon: string = 'arrow-dropleft';
  map: boolean = true;
  mapDiv = document.getElementsByClassName('map-location');
  mapIcon: string = 'close';
  constructor(public modalController: ModalController, private render: Renderer2, private toastController: ToastController) { }
  ngOnInit() {
  }
  showProfile(){
    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        /* this.presentToast('You have logged in Successfully'); */
        this.showProfile1 = true;
        this.email=firebase.auth().currentUser.email;
        
        this.db.collection("Bookings").doc(firebase.auth().currentUser.uid).collection("Requests").onSnapshot(data => {
          data.forEach(a => {
            if(a.data().bookingState === "Accepted"){ 
              this.db.collection("Bookings").doc(firebase.auth().currentUser.uid)
              .collection("Response")
              
              .onSnapshot(myItem => {
                this. MyNotifications = 0;     
                myItem.forEach(doc => {
                  if(doc.data().bookingState === "Pending"){
                  
                   this. MyNotifications += 1;
                   console.log("@@@@@@@@@@@@@",  this. MyNotifications );
                    // this.array.push(doc.data())
                    // console.log("@@@@@@@@@", this.DeliverDataService.AcceptedData);
                  }   
                })
            
          })
          // return true; 
             }
          })
        })
        
        
        // .get().then(i => {
        //   i.forEach(a => {
  
        //    if(a.data().bookingState === "Accepted"){ 
        //     this.db.collection("Bookings").doc(firebase.auth().currentUser.uid)
        //     .collection("Response").get().then(myItem => {
        //       this. MyNotifications = 0;     
        //       myItem.forEach(doc => {
        //         if(doc.data().bookingState === "Pending"){
                
        //          this. MyNotifications += 1;
        //          console.log("@@@@@@@@@@@@@",  this. MyNotifications );
        //           // this.array.push(doc.data())
        //           // console.log("@@@@@@@@@", this.DeliverDataService.AcceptedData);
        //         }   
        //       })
          
        // })
        // // return true; 
        //    }
          
        //   })
        // })
      }else {
        this.showProfile1 = false;
      }
    })
   }
  async Notifications(){
   
   let modal = await this.modalController.create({
      component : NotificationsPage,
      cssClass: 'modalNotification'
    })
    return await modal.present();
  }
  ionViewWillLeave(){
    this.Contact = [];
  } 
  ionViewWillEnter(){
    
    this.split = false;
    this.showProfile()
    setTimeout(() => {
      this.loader = false;
    }, 1000);
    if(firebase.auth().currentUser) {
      this.showProfile1 = true;
    }else {
      this.showProfile1 = false;
    }
    
    let firetattoo = {
      docid: '',
      doc: {}
    }
   
  
   
   
    this.db.collection('Admin').get().then(data => {
      
      //console.log('tt',this.Tattoos);
      data.forEach(item => {
        firetattoo.doc = item.data();
        firetattoo.docid = item.id;
        
        
        this.Contact.push(firetattoo)
        //console.log('all',this.Tattoos);
         firetattoo = {
          docid: '',
      
          doc: {}
        }
      })
      
      console.log("Contact US ",  this.Contact );
      
      
    })
  }
  addClasseAnimates() {
    this.split = !this.split
    if (this.split) {
     
       this.render.setStyle(this.splitDiv[0],'display','block'); 
     
    } else {
      setTimeout(() => {
       this.render.setStyle(this.splitDiv[0],'display','none');
       
       
      }, 500);
    }
  }
  async CreateAccount(){
    this.loader = true;
    this.split = false;
    setTimeout(() => {
      this.loader = false;
    }, 1000);
    let modal = await this.modalController.create({
      component : RegisterPage
    })
    return await modal.present();
  }
  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1000,
      position: 'bottom'
    });
    toast.present();
  }
  logOut(){
    this.loader = true
    this.split = false;
   
  
    setTimeout(() => {
      firebase.auth().signOut().then(user => {
  
        this.loader = false;
  
       this.presentToast('You are now logged out');
        
       
    
      }).catch(error => {
        console.log("Something went wrong");
        
      })
    }, 1000);
   
  
   
  }
  async Login(){
 
 
    let modal = await this.modalController.create({
      component : SignInPage,
    })
    
   // this.showProfile();
    return await modal.present();
  
}
animateContactUs() {
    this.contactUs = !this.contactUs;
    if(this.contactUs) {
      this.icon = 'arrow-dropleft';
      this.render.removeClass(this.contactUsDiv[0], 'shrink');
  
    } else {
      this.icon = 'arrow-dropright';
      this.render.addClass(this.contactUsDiv[0], 'shrink');
    }
}
animateMap() {
  this.map = !this.map;
  if(this.map) {
    this.mapIcon = 'close';
    this.render.removeClass(this.mapDiv[0], 'shrinkMap');
  } else {
    this.mapIcon = 'map';
    this.render.addClass(this.mapDiv[0], 'shrinkMap');
  
  }
}
}