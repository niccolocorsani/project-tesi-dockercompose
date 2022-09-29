import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {log} from "../decorators/log.decorator";
import {GlobalVariablesService} from "./global-variables.service";

@Injectable({
  providedIn: 'root'
})
export class GraphdbRequesDerviceToSpringAppService {


  private queryResult: any;
  variable_to_wait : any

  constructor(public http: HttpClient,public globalVaraiblesService : GlobalVariablesService) { }


  @log('',[])
  async normalQuery(queryOnlySelectClause : string) {

    queryOnlySelectClause = queryOnlySelectClause.replace('}','%7D').replace('{','%7B')
    //console.log(queryOnlySelectClause)
    await this.http.get<any>('http://127.0.0.1:8080/spring-app/queries/get?query='+queryOnlySelectClause).subscribe((value: any) => {
        this.variable_to_wait = value
      },
      (error: any) => {
        console.error(error)
      }
    );
    await this.spinner_delay()
    return this.variable_to_wait
  }


  @log('',[])
  async queryReturnListOfTriples(queryOnlySelectClause : string) {
    queryOnlySelectClause = queryOnlySelectClause.replace('}','%7D').replace('{','%7B')
    //console.log(queryOnlySelectClause)
    await this.http.get<any>('http://127.0.0.1:8080/spring-app/queries/get_list_of_triple?query='+queryOnlySelectClause).subscribe((value: any) => {
        this.variable_to_wait = value
      },
      (error: any) => {
        console.error(error)
      }
    );
    await this.spinner_delay()
    return this.variable_to_wait
  }

  @log('',[])
  async deleteEveryThing(queryOnlySelectClause : string) {

    await this.http.get<any>('http://localhost:8080/spring-app/queries/delete_everythings').subscribe((value: any) => {
        this.variable_to_wait = value
      },
      (error: any) => {
        console.error(error)
      }
    );
    await this.spinner_delay()
    return this.variable_to_wait
  }




  @log('',[])
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
