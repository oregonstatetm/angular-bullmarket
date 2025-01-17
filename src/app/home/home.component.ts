import {OnInit} from '@angular/core';
import {ViewChild, Component} from '@angular/core';
import {DxVectorMapComponent} from 'devextreme-angular';
import { DxVectorMapModule, DxSelectBoxModule, DxTextBoxModule } from 'devextreme-angular';
import { DxDataGridComponent } from 'devextreme-angular';
import { Router } from '@angular/router';
import { RealEstateService } from '../realestate/realestate.service';
import { InvestmentBoxService } from 'src/app/investmentbox/investmentbox.service';
import { InvestmentService } from 'src/app/investment/investment.service';


import * as mapsData from 'devextreme/dist/js/vectormap-data/world.js';
import {Service} from './home.service';
import {ProfileService} from '../profile/profile.service';

@Component({
  selector: 'app-home',
  providers: [Service],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})

export class HomeComponent implements OnInit {
  worldMap: any = mapsData.world;
  gdp: Object;
  animalDecider;
  selectedCountry: string;
  UID: string;
  userObject: any;
  currencyBalance: number;
  investmentValue: number;
    //Get Today's Date
    today = new Date();
    dd = String(this.today.getDate()).padStart(2,'0');
    mm = String(this.today.getMonth() + 1).padStart(2,'0');
    yyyy = this.today.getFullYear();
  
    todayString = this.yyyy + '-' + this.mm + '-' + this.dd;

  @ViewChild(DxVectorMapComponent, { static: false }) vectorMap: DxVectorMapComponent;


  constructor(service: Service,
              private profileService: ProfileService,
              private InvestmentBoxService: InvestmentBoxService,
              private InvestmentService: InvestmentService,
              private router: Router) {
    this.gdp = service.getGDP();
    this.customizeLayers = this.customizeLayers.bind(this);
    this.profileService.getAnimal()
      .subscribe(val1 => {this.animalDecider = val1;
      });
  }

  onClick(e): void {
    const target = e.target;
    if (target && this.gdp[target.attribute('name')] && target.attribute('name') !== 'Greenland') {
      this.router.navigate(['/country/' + target.attribute('name')]);
    }
  }

  customizeTooltip(arg): { text: string } {
    // console.log(arg.attribute('name'));
    if (arg.attribute('gdp')) {
      return {
        text: arg.attribute('name') + ': ' + arg.attribute('gdp') / 1000 + 'B GDP'
      };
    }
  }

  customizeLayers(elements): void {
    elements.forEach((element) => {
      element.attribute('gdp', this.gdp[element.attribute('name')]);
    });
  }

  updateRents(){

    this.InvestmentBoxService.getUserID().subscribe(data => {
      this.userObject=data;
      this.UID = this.userObject._id;


    this.InvestmentService.updateRents(this.UID);
    console.log("Today Object :");
    console.log(this.today);

    })
  }

  updateBonds(){
    console.log("Today String");
    console.log(this.todayString);
  }

  public setInitialBalance(){

     this.InvestmentBoxService.getUserID().subscribe(data => {
      this.userObject=data;
      this.UID = this.userObject._id;

    this.InvestmentService.getCurrencyBalance(this.UID,"DOLLAR").then(result =>{
      this.currencyBalance = result;

    this.InvestmentService.getInvestmentValue(this.UID).then(result2 =>{
      this.investmentValue = result2;


      if(this.currencyBalance==0 && this.investmentValue==0) // BUG FIX - Add investmentValue to ensure that player doesn't get 100k just for reaching 0 balance.
      {
       this.InvestmentBoxService.addBaseCurrency(this.UID,"DOLLAR",100000, this.todayString);
      }
    })
   });

  });
  }

  // customizeText(arg) {
  //   let text;
  //   if(arg.index === 0) {
  //     text = '< 0.5%';
  //   } else if(arg.index === 5) {
  //     text = '> 3%';
  //   } else {
  //     text = arg.start + '% to ' + arg.end + '%';
  //   }
  //   return text;
  // }

  // constructor() { }

  ngOnInit(): void { 
    this.setInitialBalance(); 
    this.updateRents();
    this.updateBonds();
  }

}
