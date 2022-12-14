import {Component, OnInit} from '@angular/core';
import {Chart} from "chart.js";
import zoomPlugin from 'chartjs-plugin-zoom';
import {Router} from "@angular/router";
import {GlobalVariablesService} from "../services/global-variables.service";
import {classDecorator, log} from "../decorators/log.decorator";

Chart.register(zoomPlugin);

//  https://stackoverflow.com/questions/67060070/chart-js-core-js6162-error-error-line-is-not-a-registered-controller

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
@classDecorator
export class AppComponent  implements OnInit{

  constructor(private router: Router, public globalVaraibleService: GlobalVariablesService) {
  }

  ngOnInit(): void {
    let keys = Object.keys(this.globalVaraibleService.variables)




    }



  navigateTab(viewName: string) {
    let nodiRottiString = ''
    this.globalVaraibleService.nodiRotti.forEach(nodoRotto => {
      // @ts-ignore
      if (nodoRotto.includes('oglia') || nodoRotto.includes('rediction')) {
      } else
        nodiRottiString = nodiRottiString + nodoRotto + ','
    })
    nodiRottiString = nodiRottiString.substring(0, nodiRottiString.length - 1)
    // @ts-ignore
    this.router.navigate([]).then(result => {
      window.open(viewName + '?rotti=' + nodiRottiString, '_blank');
    });

  }





}


