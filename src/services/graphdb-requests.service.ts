import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {log} from "../decorators/log.decorator";

@Injectable({
  providedIn: 'root'
})
export class GraphdbRequestsService {


  distanceImpianti: any
  distanceNodes: any
  queryResult: any

  constructor(public http: HttpClient) {
  }


  @log()
  async normalQuery() {
    await this.http.get<any>('http://127.0.0.1:8081/query/').subscribe((value: any) => {
        this.queryResult = value
      },
      (error: any) => {
        this.queryResult = 'x'
        console.error(error)
      }
    );
    await this.delay(100);
    return this.queryResult
  }



  @log()
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
    await this.delay(100);
    return this.distanceNodes
  }

  @log()
  async getDistanceBetweenImpianti(impianto1: string, impianto2: string) {
    await this.http.get<any>('http://127.0.0.1:8081/impianti-distance/?impianto=' + impianto1 + '*' + impianto2).subscribe(async (value: any) => {
        this.distanceImpianti = value
      }
      ,
      (error: any) => {
        this.distanceImpianti = 'x'
        console.error(error)
      });
    await this.delay(100);
    return this.distanceImpianti
  }


  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

}
