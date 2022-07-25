import { Component, OnInit } from '@angular/core';
import { ScriptService } from 'src/app/services/script.service';

export interface Technic {
  name: String;
  // в метрах
  width: Number;
  // в метрах
  height: Number;
  // в метрах
  length: Number;
  // в мм
  boomLength: Number;
  // в тоннах
  weight: Number;
  //  в мм
  trackWidth: Number;
  // кВТ
  power: Number;
  // литры
  volume: Number;
  // литры/час
  consumption: Number;
  // мм
  bucketWidth: Number;
  // мм
  handleLength: Number;
  // метры
  diggingDepth: Number;
  // мм
  maxDiggingDepth: Number;
  // мм
  maxDigHeight: Number;
  // кг/см^3
  pressure: Number;
  // долгота
  longitude: String;
  // широта
  latitude: String;
}

@Component({
  selector: 'app-technic-info',
  templateUrl: './technic-info.component.html',
  styleUrls: ['./technic-info.component.scss']
})
export class TechnicInfoComponent implements OnInit {

  constructor(private script: ScriptService) { }

  ngOnInit(): void {
    this.script.load('map').then(data => {
      console.log('script loaded', data);
    }).catch(error => console.log(error));
  }

  tec: Technic = {
    name: 'Наименование',
    // в метрах
    width: 9.87,
    // в метрах
    height: 2.98,
    // в метрах
    length: 3.22,
    // в мм
    boomLength: 5850,
    // в тоннах
    weight: 23.2,
    //  в мм
    trackWidth: 600,
    // кВТ
    power: 134,
    // литры
    volume: 6.69,
    // литры/час
    consumption: 16.22,
    // мм
    bucketWidth: 1000,
    // мм
    handleLength: 3045,
    // метры
    diggingDepth: 7,
    // мм
    maxDiggingDepth: 6920,
    // мм
    maxDigHeight: 10000,
    // кг/см^3
    pressure: 0.52,
    // долгота
    longitude: '56.304435',
    // широта
    latitude: '44.077681'
  }

}
