import { SuccessPagePageModule } from './../pages/success-page/success-page.module';
import { DeliverDataService } from './../deliver-data.service';
import { ModalController } from '@ionic/angular';
import { Component, OnInit, Renderer2 } from '@angular/core';
import * as firebase from 'firebase';
import { SuccessPagePage } from '../pages/success-page/success-page.page';
import { Validators, FormControl, FormBuilder, FormGroup } from '@angular/forms';




@Component({
  selector: 'app-booking-modal',
  templateUrl: './booking-modal.page.html',
  styleUrls: ['./booking-modal.page.scss'],
})
export class BookingModalPage implements OnInit {


    Length : number ;
    Breadth : number;
    
    describe = false;
    describeDiv = document.getElementsByClassName('description');
    icon = 'ios-arrow-up';
    category = "" 
    description = "" 
    image = "" 
    priceRange = "" 
    name = "";
  
    Cname = "";
    number : any = 0;
    db = firebase.firestore()
    tattooForm : FormGroup;
    validation_messages = {
      'Length': [
        { type: 'required', message: 'Length  is required.' },
  
      ],
      'Breadth': [
        { type: 'required', message: 'Breadth  is required.' },
  
      ],
    }
  loader: boolean = false;
        

  constructor(public DeliverDataService: DeliverDataService,private fb: FormBuilder, private modalController: ModalController, private render: Renderer2) { 
  this.tattooForm = this.fb.group({
    Length: new FormControl('', Validators.compose([Validators.required])),
    Breadth: new FormControl('', Validators.compose([Validators.required])),
  })
}
  ngOnInit() {

    this.db.collection("Bookings").doc(firebase.auth().currentUser.uid).get().then(data => {
      this.Cname = data.data().name;  
      this.number = data.data().number;
    })

  }
  

  

  ionViewWillEnter(){

    this.loader = true;

    setTimeout(() => {
      this.loader = false;
      this.category = this.DeliverDataService.dataSaved.category ;
      this.description = this.DeliverDataService.dataSaved.description  ;
      this.image = this.DeliverDataService.dataSaved.image  ;
      this.name = this.DeliverDataService.dataSaved.name;
      this.priceRange = this.DeliverDataService.dataSaved.pricerange  ;
    }, 1000);
    
    this.category = this.DeliverDataService.dataSaved.category ;
    this.description = this.DeliverDataService.dataSaved.description  ;
    this.image = this.DeliverDataService.dataSaved.image  ;
    this.name = this.DeliverDataService.dataSaved.name  ;
    this.priceRange = this.DeliverDataService.dataSaved.pricerange  ;

  
    console.log("Data in the booking modal" ,  this.description );

  }

  closeDescriptionAnimate() {
    this.describe = !this.describe;
    this.loader = true;
    setTimeout(() => {
      if (this.describe) {
     /*    this.render.setStyle(this.describeDiv[0],'display','block'); */
        this.render.setStyle(this.describeDiv[0],'height','80%');
        /*  this.render.setStyle(this.describeDiv[0],'overflow','auto'); */
        this.icon = 'ios-arrow-down';
      } else {
        setTimeout(() => {
         this.render.setStyle(this.describeDiv[0],'height','5%');
         /* this.render.setStyle(this.describeDiv[0],'overflow','hidden'); */
         this.icon = 'ios-arrow-up';
         /* this.render.setStyle(this.describeDiv[0],'display','none'); */
        }, 500);
      }
      this.loader = false;
    }, 1000);
    
    
  }

  senBookig(){

    this.loader = true;


    setTimeout(() => {
      if (this.tattooForm.valid ) {
        this.db.collection("Bookings").doc(firebase.auth().currentUser.uid).collection("Requests").doc().set({
    
                
          category : this.category,
          description : this.description,
          image : this.image,
          priceRange :  this.priceRange,
          tattoName: this.name,
          breadth : this.Breadth,
          length : this.Length,
          email : firebase.auth().currentUser.email,
          uid : firebase.auth().currentUser.uid,
          customerName : this.Cname,
          number : this.number,
          bookingState : 'waiting',
          field : "Booking"
    
    
        }).then( async() => {
    
          console.log("Sorry no user here");
          const modal = await this.modalController.create({
            component: SuccessPagePage
          });
          return await  modal.present();
    
        })
    
        this.db.collection("Requests").doc().set({
          category : this.category,
          description : this.description,
          image : this.image,
          priceRange :  this.priceRange,
          tattoName: this.name,
          breadth : this.Breadth,
          length : this.Length,
          email : firebase.auth().currentUser.email,
          uid : firebase.auth().currentUser.uid,
          customerName : this.Cname,
          number : this.number,
          bookingState : 'waiting',
          field : "Booking"
    
        })
    
        this.modalController.dismiss({
          'dismissed': true
        });
      }

      this.loader = false;
      
    }, 1000);
 
  


 
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }



}
