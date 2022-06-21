import {Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Chart, registerables} from "chart.js";
import {LineController} from "chart.js";


//https://stackoverflow.com/questions/67060070/chart-js-core-js6162-error-error-line-is-not-a-registered-controller

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'chartjs';


  dataArray: any = [];

  list = [];

  time_events = [];

  temperaturareattoreR4001Values = [];

  myObserver = {
    next: (value: any) => {
      this.list = value;
    },
    error: (err: any) => {
      console.log('error');
      console.log(err);
    },
  };

  constructor(public http: HttpClient) {
    Chart.register(...registerables);
  }

  async ngOnInit() {
    await this.http.get<any>('assets/csvjson.json').subscribe(this.myObserver);
    await this.delay(1000);
    await this.delay(1000);
    this.addX();
    this.addTemperaturareattoreR4001();
    this.render()
    this.render1()
  }

  addX() {
    this.list.forEach((value) => {
      // @ts-ignore
      this.time_events.push(value.timestamp);
    });
    console.log(this.time_events);
  }

  addTemperaturareattoreR4001() {
    this.list.forEach((value) => {
      // @ts-ignore
      this.temperaturareattoreR4001Values.push(value.TemperaturareattoreR4001);
    });
    console.log(this.temperaturareattoreR4001Values);
  }


  render() {
    let data: any,
      options: any,
      chart: any,
      ctx: any = document.getElementById('areaChart') as HTMLElement;

    data = {
      labels: this.time_events,
      datasets: [
        {
          label: 'Temperatura Reattore R4001',
          data: this.temperaturareattoreR4001Values,
          backgroundColor: 'rgba(40,125,200,.5)',
          borderColor: 'rgb(40,100,200)',
          fill: true,
          lineTension: 0,
          radius: 5,
        },
      ],
    };
    options = {
      responsive: true,
      maintainAspectRatio: false,
      title: {
        display: true,
        position: 'top',
        fontSize: 12,
        fontColor: '#666',
      },
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          fontColor: '#999',
          fontSize: 14,
        },
      },
    };
    chart = new Chart(ctx, {
      type: 'polarArea',
      data: data,
      options: options,
    });
  }

  render1() {
    let data: any,
      options: any,
      chart1,
      ctx1: any = document.getElementById('areaChart1') as HTMLElement;

    data = {
      labels: this.time_events,
      datasets: [
        {
          label: 'Temperatura Reattore R4001',
          data: this.temperaturareattoreR4001Values,
          backgroundColor: 'rgba(40,125,200,.5)',
          borderColor: 'rgb(40,100,200)',
          fill: true,
          lineTension: 0,
          radius: 5,
        },
      ],
    };

    options = {
      responsive: true,
      maintainAspectRatio: false,
      title: {
        display: true,
        position: 'top',
        fontSize: 12,
        fontColor: '#666',
      },
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          fontColor: '#999',
          fontSize: 14,
        },
      },
    };


    chart1 = new Chart(ctx1, {
      type: 'bar',
      data: data,
      options: options,
    });
  }

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
