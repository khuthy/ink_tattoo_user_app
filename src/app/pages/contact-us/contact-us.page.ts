import { NotificationsPage } from './../../notifications/notifications.page';
import { Component, OnInit, Renderer2 } from '@angular/core';
import * as firebase from 'firebase';
import { ModalController } from '@ionic/angular';
import { SignInPage } from '../sign-in/sign-in.page';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage implements OnInit {


  Contact = [];
  db = firebase.firestore();

  contactUs: boolean = true;
  contactUsDiv = document.getElementsByClassName('contact-information');
  icon: string = 'arrow-dropleft';
  map: boolean = true;
  mapDiv = document.getElementsByClassName('map-location');
  mapIcon: string = 'close';
  constructor(public modalController: ModalController, private render: Renderer2) { }

  ngOnInit() {
  }

  async Notifications(){
   
   let modal = await this.modalController.create({
      component : NotificationsPage,
      cssClass: 'modalNotification'
    })
    return await modal.present();
  }


  ionViewWillEnter(){
    
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
