import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { API } from 'enveriment';

export interface TechnicListItem {
  img: String;
  name: String;
  status: String;
  mileage: Number;
  characteristic: Number;
}

@Component({
  selector: 'app-technics-list',
  templateUrl: './technics-list.component.html',
  styleUrls: ['./technics-list.component.scss']
})
export class TechnicsListComponent implements OnInit {
  public user_id = localStorage.getItem("user");
  public selected_month:any;
  public monthes = [
    {name: "Январь", index:"01"},
    {name: "Февраль", index:"02"},
    {name: "Март", index:"03"},
    {name: "Апрель", index:"04"},
    {name: "Май", index:"05"},
    {name: "Июнь", index:"06"},
    {name: "Июль", index:"07"},
    {name: "Август", index:"08"},
    {name: "Сентябрь", index:"09"},
    {name: "Октябрь", index:"10"},
    {name: "Ноябрь", index:"11"},
    {name: "Декабрь", index:"12"},
    {name: "Все", index:"00"}
  ]
  public technics:any[] = [];
  technicsList: TechnicListItem[] = [
    {
      img: '../../../assets/img/sharing__bg.png',
      name: '10011 KOMATSU PC55MR Экскаватор 5914рт78',
      status: 'В простое',
      mileage: 687,
      characteristic: 787
    },
    {
      img: '../../../assets/img/sharing__bg.png',
      name: '10011 KOMATSU PC55MR Экскаватор 5914рт78',
      status: 'Работает в нормальном режиме',
      mileage: 687,
      characteristic: 787
    },
    {
      img: '../../../assets/img/sharing__bg.png',
      name: '10011 KOMATSU PC55MR Экскаватор 5914рт78',
      status: 'В простое',
      mileage: 687,
      characteristic: 787
    },
    {
      img: '../../../assets/img/sharing__bg.png',
      name: '10011 KOMATSU PC55MR Экскаватор 5914рт78',
      status: 'Работает в нормальном режиме',
      mileage: 687,
      characteristic: 787
    },
    {
      img: '../../../assets/img/sharing__bg.png',
      name: '10011 KOMATSU PC55MR Экскаватор 5914рт78',
      status: 'В простое',
      mileage: 687,
      characteristic: 787
    },
    {
      img: '../../../assets/img/sharing__bg.png',
      name: '10011 KOMATSU PC55MR Экскаватор 5914рт78',
      status: 'Работает в нормальном режиме',
      mileage: 687,
      characteristic: 787
    },

  ]

  constructor(private httpService: HttpClient) { }

  ngOnInit(): void {
  }

  get_technics_list(selected_month:string){
    console.log(selected_month);
    this.httpService.get(API+'get_status'+ '?filter=' + selected_month).subscribe((value:any) => {
      this.technics = value.result;
      console.log(this.technics);
    })
  }

}
