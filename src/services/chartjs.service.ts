import {Injectable} from '@angular/core';
import {Chart} from "chart.js";

@Injectable({
  providedIn: 'root'
})
export class ChartjsService {

  constructor() {
  }

  createTimeEventsAndDataSetFromJson(json: any) {


    let jsonObject = json
    let time_events = Object.keys(jsonObject)
    let dataset = [{}]
    let list_of_keys = Object.getOwnPropertyNames(jsonObject[time_events[0]]) // to get names of keys of the first object wich are the same for all the others
    list_of_keys.forEach(key => {
      let list_of_Y: any[];
      list_of_Y = [];
      time_events.forEach((value: any) => {
        // @ts-ignore
        if (!String(key).includes('prediction')) {
          list_of_Y.push(jsonObject[value][key])
        }
        if (String(key).includes('prediction')) { // @ts-ignore
          // @ts-ignore
          list_of_Y.push(Number(jsonObject[value][key]) / 10)
        }
      })
      let color = this.getRandomColor()
       dataset.push({
        label: key,
        // @ts-ignore
        data: list_of_Y,
        borderColor: color,
        fill: true,
        lineTension: 0,
        radius: 1,
        hidden: true
      })
    })


    return [dataset, time_events]

  }

  filterDataSetByThreshold(dataset: any, threshold: number) {
    let over_list: any[] = []
    dataset.forEach((value: any) => {
      for (let element of value.data) {
        if (element < 0) element = -element
        if (element > threshold) {
          value.hidden = false
          over_list.push(value.label)
          break
        }
      }
    })
    return [dataset,over_list]
  }



  addSoglia(soglia: number, dataset: any) {

    Chart.getChart('areaChart')?.destroy()
    Chart.getChart('areaChart1')?.destroy()

    let list_y = []
    for (var i = 0; i < 3608; i++) {
      list_y.push(soglia)
    }
    dataset.push({
      label: 'soglia',
      data: list_y,
      borderColor: '#ff0000',
      fill: true,
      lineTension: 0,
      radius: 1,
      hidden: true
    })

    return dataset
  }

  render(time_events: any, dataset: any) {



    let data: any,
      options: any,
      chart: any,
      ctx: any = document.getElementById('areaChart') as HTMLElement;

    data = {
      labels: time_events,
      datasets: dataset
    }


    options = {


      animation: false,
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        zoom: {
          pan: {
            enabled: true // per spostarsi all'interno del grafo
          },
          zoom: {
            wheel: {
              enabled: true,
              drag: true // Enable drag-to-zoom behavior

            },
            pinch: {
              enabled: true
            },
            mode: 'xy'
          }
        }
      },

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
      type: 'line',
      data: data,
      options: options,

    });
  }

  renderWithRange(time_events: any, dataset: any) {

    Chart.getChart('areaChart1')?.destroy()

    let data: any,
      options: any,
      chart: any,
      ctx: any = document.getElementById('areaChart1') as HTMLElement;

    data = {
      labels: time_events,
      datasets: dataset
    }


    options = {


      animation: false,

      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        zoom: {
          pan: {
            enabled: true // per spostarsi all'interno del grafo
          },
          zoom: {
            wheel: {
              enabled: true,
              drag: true // Enable drag-to-zoom behavior

            },
            pinch: {
              enabled: true
            },
            mode: 'xy'
          }
        }
      },

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
      type: 'line',
      data: data,
      options: options,
    });
  }

  getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }


}
