import { Component, OnInit, Renderer2 } from '@angular/core';
import * as firebase from 'firebase';
import { DeliverDataService } from 'src/app/deliver-data.service';
import { Router } from '@angular/router';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { ModalController } from '@ionic/angular';
import { NotificationsPage } from 'src/app/notifications/notifications.page';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  providers: [DatePipe]
})

export class ProfilePage implements OnInit {
  respnses=[]

  constructor(private DeliverDataService: DeliverDataService,private rout: Router, private modalController: ModalController, private rendered: Renderer2,private file:File, public fileTransfer : FileTransferObject,  private transfer: FileTransfer)  { this.respnses = this.DeliverDataService.AcceptedData; }

  pdf;
  loader = true;
  User=[];

  email: string;

  Requests=[];
  Bookings=[];

  startingDate;
  endingDate;

  Response=[];

  userID :string;

  name="";

  size;
  PendingSize=0;
  

  edit: boolean = false;
  editDivModal = document.getElementsByClassName('modal');
  
  db = firebase.firestore();

  ngOnInit() {
  }

  logout(){
    this.loader = true;
    this.DeliverDataService.logoutUser().then(()=>{
      this.rout.navigateByUrl('xplore');
      setTimeout(() => {
        this.loader = false;
      }, 4000);
    })
    }


    modalAnimate() {
      this.edit = !this.edit;
      if(this.edit) {
        this.rendered.addClass(this.editDivModal[0], 'modalView');
      }else {
        this.rendered.addClass(this.editDivModal[0], 'modalHide');
      }
    }
  

    async Notifications(){
      console.log("ttttttttt", this.respnses);
     let modal = await this.modalController.create({
        component : NotificationsPage,
        cssClass: 'modalNotification'
      })
      return await modal.present();
    }
    diff;
    diffDays;
    

  ionViewWillEnter(){

         //User's details
         this.email=firebase.auth().currentUser.email;
   
         this.db.collection("Bookings").onSnapshot(data => {
        
          
           data.forEach(item => {
             
             if(item.exists){

             
               if(item.data().email === this.email){

                this.DeliverDataService.name = item.data().name;
                this.name = item.data().name
                
                 this.User.push(item.data());
              
                 this.User=[];
                 console.log("Testing",item.data().name);
               }
             }
           })
         })
       

      
    if(firebase.auth().currentUser){

    //  console.log("Your  pb data ", Bookings);
      console.log("Your pb here is ", firebase.auth().currentUser.uid);
      console.log("Your email here is ", firebase.auth().currentUser.email);
     // this.User.push(item.data());




        


        
        //User's details
          this.email=firebase.auth().currentUser.email;

          this.db.collection("Bookings").onSnapshot(data => {         
            data.forEach(item => {
              if(item.exists){
                if(item.data().email === this.email){
                  
                  this.User.push(item.data());
                  console.log("Testing",this.User);
                }
              }
            })
          })
        
        
         // this.Date;


        //Response  
      this.db.collection("Bookings").doc(firebase.auth().currentUser.uid).collection("Response").get().then(data => {
       
        data.forEach(i => {
          this.Response=[];
          data.forEach(i => {
           
            if(i.exists){
              if(i.data().bookingState === "Accepted"){
                
                console.log("ewewew ", i.data());
                this.Response.push(i.data());

                this.size=  this.Response.length;
                
                //this.date=i.data().startdate;
                
             
               
              }
             
            }
          })
    
         
          
        })
      })
      


      //Pending
      this.db.collection("Bookings").doc(firebase.auth().currentUser.uid).collection("Requests").get().then(data => {
        data.forEach(i => {
          data.forEach(i => {
            if(i.exists){
              if(i.data().bookingState === "waiting"){
                this.Requests=[];
                console.log("ewewew ", i.data());
                this.Requests.push(i.data());
              
                this.PendingSize=  this.Requests.length;
              }
            }
          })
    

          
        })
      })


  
    
      // this.db.collection("Bookings").doc(firebase.auth().currentUser.uid).collection("Requests").get().then(data => {
      //   data.forEach(i => {
      //     console.log("ewewew ", i.data());
      //     this.Requests.push(i.data());

          
      //   })
      // })
      


  
      // this.db.collection("Bookings").doc(firebase.auth().currentUser.uid).collection("Response").get().then(data => {
      //   data.forEach(i => {
      //     console.log("Response ", i.data());

      //     this.Response.push(i.data());
          
      //   })
      // })

    

      
  }





}
download() {

  const fileTransfer: FileTransferObject = this.transfer.create();
  fileTransfer.download(this.pdf, this.file.dataDirectory + 'file.pdf').then((entry) => {
    console.log('download complete: ' + entry.toURL());
  }, (error) => {
    // handle error
  });
  
}

}

