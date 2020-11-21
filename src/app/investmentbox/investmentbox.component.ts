import { Component, OnInit, OnDestroy } from '@angular/core';
import { Investment } from './investment.model';
import { InvestmentBoxService } from './investmentbox.service';
import {MatTableDataSource} from '@angular/material/table';
import { Injectable, EventEmitter } from '@angular/core';    
import { Subscription } from 'rxjs/internal/Subscription';  
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { StockService } from 'src/app/stocks/stock.service';
import { Stock } from 'src/app/stocks/stock.model';
import { AuthService } from 'src/app/auth/auth.service';
import { AuthData } from 'src/app/auth/auth-data.model';

interface IDAuthData{
  _id: string;
  email: string;
  userName: string;
};

@Component({
  selector: 'app-investmentbox',
  templateUrl: './investmentbox.component.html',
  styleUrls: ['./investmentbox.component.css'],
})
export class InvestmentBoxComponent {

  filteredOptions: Observable<string[]>;
  myControl = new FormControl();
  options=['SLV','GLD','TIN', 'USA10Y', 'CAN10Y','NOK','MSFT'];
  stockTicker="MSFT";
  stock: Stock;
  stock2: Stock;
  UID: string;
  userObject: any;

  

    constructor(private investmentApi: InvestmentBoxService, private stockApi: StockService) {
        this.investmentApi.getUserID().subscribe(data => {
          this.userObject=data;
          this.UID = this.userObject._id;
      });

    }

    private _filter(value: string): string[] {
      const filterValue = value.toLowerCase();

      return this.options.filter(option => option.toLowerCase().includes(filterValue));
    }


  ngOnInit() {

  };
  


  onClickBuy(symbol, shares){
    console.log("Buy ", shares, " shares of ", symbol);
    this.stockApi.getOneStock(symbol).subscribe(stockData2 => {
      this.stock2 = {
        stockName: stockData2.stockName,
        symbol: stockData2.symbol,
        price: stockData2.price,
        marketCap: stockData2.marketCap,
        closeDate: stockData2.closeDate,
        pERatio: stockData2.pERatio
      };
      console.log("stockData: ")
      console.log(this.stock2.price[0]);
      console.log(this.UID);
      this.investmentApi.buyInvestment(this.UID,this.stock2.stockName,this.stock2.symbol,this.stock2.price[0],shares,'b','stock');
    });
  }


  onClickSell(symbol, shares){
    console.log("Sell ", shares, " shares of ", symbol);
    this.stockApi.getOneStock(symbol).subscribe(stockData2 => {
      this.stock2 = {
        stockName: stockData2.stockName,
        symbol: stockData2.symbol,
        price: stockData2.price,
        marketCap: stockData2.marketCap,
        closeDate: stockData2.closeDate,
        pERatio: stockData2.pERatio
      };
      console.log("stockData: ")
      console.log(this.stock2.price[0]);
      console.log(this.UID);
      this.investmentApi.sellInvestment(this.UID,this.stock2.stockName,this.stock2.symbol,this.stock2.price[0],-Math.abs(shares),'s','stock');
    });
  }

 
};