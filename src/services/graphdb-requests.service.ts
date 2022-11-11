import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {log} from "../decorators/log.decorator";
import {GlobalVariablesService} from "./global-variables.service";

@Injectable({
  providedIn: 'root'
})
export class GraphdbRequestsService {


  distanceImpianti: any
  distanceNodes: any
  queryResult: any
  variable_to_wait : any

  constructor(public http: HttpClient, public globalVaraiblesService: GlobalVariablesService) {
  }


  @log('', [])
  async normalQuery() {
    await this.http.get<any>('http://127.0.0.1:8081/query/').subscribe((value: any) => {
        this.variable_to_wait = value
      },
      (error: any) => {
        this.queryResult = 'x'
        console.error(error)
      }
    );
    await this.delay(1000)

    await this.spinner_delay()
    return this.variable_to_wait
  }


  @log('', [])
  async queryWithSpecifiedPredicate(predicateWithoutPrefissoDeiDuePunti: string) {
    await this.http.get<any>('http://127.0.0.1:8081/query-with-specified-predicated/?predicate=' + predicateWithoutPrefissoDeiDuePunti).subscribe((value: any) => {
        this.variable_to_wait = value
      },
      (error: any) => {
        this.queryResult = 'x'
        console.error(error)
      }
    );
    await this.delay(1000)

    await this.spinner_delay()
    return this.variable_to_wait
  }

  @log('', [])
  async getDistanceBetweenNodes(node1: string, node2: string) {
    await this.http.get<any>('http://127.0.0.1:8081/nodes-distance/?node=' + node1 + '*' + node2).subscribe((value: any) => {
        this.distanceNodes = value
        console.log('observer get ' + value)
      },
      (error: any) => {
        this.distanceNodes = 'x'
        console.error(error)
      }
    );
    await this.delay(1000) // QUESTO HA RISOLTO IL PROBLEMA DELL'asincronicità
    await this.spinner_delay()
    return this.distanceNodes
  }


  @log('', [])
  async getPathBetweenNodes(node1: string, node2: string) {
    await this.http.get<any>('http://127.0.0.1:8081/nodes-distance/?node=' + node1 + '*' + node2).subscribe((value: any) => {
        this.distanceNodes = value
        console.log('observer get ' + value)



      },
      (error: any) => {
        this.distanceNodes = 'x'
        console.error(error)

      }
    );
    await this.delay(1000)

    await this.spinner_delay()
    return this.distanceNodes
  }

  @log('', [])
  async queryWithSpecifiedWithSlectStatementTranneGraffe(selectStatmentSenzaGraffe: string) {
    await this.http.get<any>('http://127.0.0.1:8081/query-with-specified-statement-senza-graffa/?statement_senza_graffe=' + selectStatmentSenzaGraffe).subscribe((value: any) => {
        this.variable_to_wait = value
      },
      (error: any) => {
        this.queryResult = 'x'
        console.error(error)
      }
    );
    await this.spinner_delay()
    return this.variable_to_wait
  }


  @log('', [])
  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }


  async spinner_delay() {
    this.globalVaraiblesService.spinner = true
    while (this.variable_to_wait === undefined) {
      await this.delay(1000)
    }
    this.globalVaraiblesService.spinner = false
  }
}
