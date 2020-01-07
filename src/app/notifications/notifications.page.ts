import { ModalController } from '@ionic/angular';
import { DeliverDataService } from './../deliver-data.service';
import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  db = firebase.firestore();
  array = [];
  showMessage : boolean;
  message = "";

  constructor(public DeliverDataService : DeliverDataService, private modalController: ModalController ) {
    this.array = [];
    this.array = this.DeliverDataService.AcceptedData;
    console.log("Data in the Notifications ", this.array);
    
   }

  ngOnInit() {

    if(firebase.auth().currentUser){

      this.db.collection("Bookings").doc(firebase.auth().currentUser.uid).collection("Requests").get().then(i => {
        i.forEach(a => {

         if(a.data().bookingState === "Accepted"){   
          this.db.collection("Bookings").doc(firebase.auth().currentUser.uid).collection("Response").get().then(myItem => {
            this.array = [];       
            myItem.forEach(doc => {
              if(doc.data().bookingState === "Pending"){
               
                this.array.push(doc.data())
                // console.log("@@@@@@@@@", this.DeliverDataService.AcceptedData);
              }   
            })
        
      })
      // return true; 
         }
        
        })
      })
    }

  }

  Decline(data, i){

    
    this.array.splice(i, 1);

  let obj = {
    startingDate : "",
    endingDate : "",
    price : "",
    uid : "",
    bookingState : "",
    auId : "",
    image : ""
  }
      
      this.db.collection("Bookings").doc(firebase.auth().currentUser.uid).collection("Response").get().then(myItem => {       
        myItem.forEach(doc => {
          if(doc.data().auId === data.auId){
            
          console.log("Declined obj", doc.data());
          
          obj.startingDate =  doc.data().startingDate,
          obj.endingDate =  doc.data().endingDate,
          obj.price =  doc.data().price,
          obj.price  =  doc.data().uid,
          obj.bookingState =  "Pending",
          obj.auId = doc.data().auId,
          obj.image =  doc.data().image,doc.data()

          this.updateDecline(doc.data().auId, doc.data());

          }   
        })
    
  })

  }

  updateDecline(auId, obj){

    this.db.collection("Bookings").doc(firebase.auth().currentUser.uid).collection("Response").doc(auId).update({
      startingDate : obj.startingDate,
      endingDate : obj.endingDate,
      price : obj.price ,
      uid : obj.price ,
      bookingState : "Decline",
      auId : obj.auId,
      image : obj.image
    })

    console.log("updateDecline successfully");

    this.db.collection("Users").doc().set({

      startingDate : obj.startingDate,
      endingDate : obj.endingDate,
      price : obj.price ,
      uid : obj.price ,
      bookingState : "Decline",
      auId : obj.auId,
      image : obj.image

    })
    
  }
  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  Accept(data, i){

    console.log("a", data.uid);
    this.showMessage = true;
    this.message = "Accept";
   

    setTimeout(() => {
      console.log("ACCEPTED DATA");
      this.array.splice(i, 1);
     
    },2000);
    
   

    let obj = {
      startingDate : "",
      endingDate : "",
      price : "",
      uid : "",
      bookingState : "",
      auId : "",
      image : ""
    }
        
        this.db.collection("Bookings").doc(firebase.auth().currentUser.uid).collection("Response").get().then(myItem => {       
          myItem.forEach(doc => {
            if(doc.data().auId === data.auId){
              
            console.log("Declined obj", doc.data());
            
            obj.startingDate =  doc.data().startingDate,
            obj.endingDate =  doc.data().endingDate,
            obj.price =  doc.data().price,
            obj.price  =  doc.data().uid,
            obj.bookingState =  "Pending",
            obj.auId = doc.data().auId,
            obj.image =  doc.data().image,doc.data()
  
            this.updateAccept(doc.data().auId, doc.data());
  
            }   
          })
      
    })


  
  
  }



  updateAccept(auId, obj){

    this.db.collection("Bookings").doc(firebase.auth().currentUser.uid).collection("Response").doc(auId).update({
      startingDate : obj.startingDate,
      endingDate : obj.endingDate,
      price : obj.price ,
      uid : obj.price ,
      bookingState : "Accepted",
      auId : obj.auId,
      image : obj.image
    })

    console.log("updateAccept successfully");
    
    
    this.db.collection("Users").doc().set({

      startingDate : obj.startingDate,
      endingDate : obj.endingDate,
      price : obj.price ,
      uid : obj.price ,
      bookingState : "Accepted",
      auId : obj.auId,
      image : obj.image

    })

  }

}
