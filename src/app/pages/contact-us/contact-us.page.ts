import { NotificationsPage } from './../../notifications/notifications.page';
import { Component, OnInit, Renderer2 } from '@angular/core';
import * as firebase from 'firebase';
import { ModalController } from '@ionic/angular';
import { SignInPage } from '../sign-in/sign-in.page';
import { DeliverDataService } from './../../deliver-data.service';
@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage implements OnInit {
  Contact = [];
  db = firebase.firestore();
  ShowName=[];
  
  name = "";
  email: string;
  showProfile1;
  showNotific;
  contactUs: boolean = true;
  contactUsDiv = document.getElementsByClassName('contact-information');
  icon: string = 'arrow-dropleft';
  map: boolean = true;
  mapDiv = document.getElementsByClassName('map-location');
  mapIcon: string = 'close';
  constructor(public modalController: ModalController, private render: Renderer2,private DeliverDataService : DeliverDataService) { }
  ngOnInit() {
  }
  async Notifications(){
   
   let modal = await this.modalController.create({
      component : NotificationsPage,
      cssClass: 'modalNotification'
    })
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
  ionViewWillEnter(){
    
    let firetattoo = {
      docid: '',
      doc: {}
    }
   
   
    this.db.collection('Admin').get().then(data => {
      
      //console.log('tt',this.Tattoos);
      data.forEach(item => {
        this.Contact=[];
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
    this.showNotification();
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
 
   showNotification(){
    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        this.showNotific = true;
      }else {
        this.showNotific = false;
      }
    })
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