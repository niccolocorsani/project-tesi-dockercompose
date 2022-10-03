import {Component, OnInit} from '@angular/core';
import {GlobalVariablesService} from "../../services/global-variables.service";
import {MatCheckboxChange} from "@angular/material/checkbox";

@Component({
  selector: 'app-queries-view',
  templateUrl: './queries-view.component.html',
  styleUrls: ['./queries-view.component.css']
})
export class QueriesViewComponent implements OnInit {

  newItem: string | undefined;
  someQuries = [
    ' select * where { \n' +
    '    ?s  ?p ?o.\n' +
    '    ?p  rdfs:subPropertyOf :to.\n' +
    '\t?s  :isSchermata "STOCCAGGIO_IPOCLORITO_DI_SODIO.txt".\n' +
    '} \n'
    ,
    ' select * where { \n' +
    '    ?s  ?p ?o.\n' +
    '    ?p  rdfs:subPropertyOf :to.\n' +
    '\t?s  :isSchermata "CARICO_FERRICO_FERROSO.txt".\n' +
    '} \n'
    ,
    ' select * where { \n' +
    '    ?s  ?p ?o.\n' +
    '    ?p  rdfs:subPropertyOf :to.\n' +
    '\t?s  :isSchermata "CARICO_FERRICO_FERROSO_2.txt".\n' +
    '} \n'
    ,
    ' select * where { \n' +
    '    ?s  ?p ?o.\n' +
    '    ?p  rdfs:subPropertyOf :to.\n' +
    '\t?s  :isSchermata "FERRICO_FERROSO_CLORO_FERRO.txt".\n' +
    '} \n'
    ,
    ' select * where { \n' +
    '    ?s  ?p ?o.\n' +
    '    ?p  rdfs:subPropertyOf :to.\n' +
    '\t?s  :isSchermata "HCL_1_LINEA_(FG600).txt".\n' +
    '} \n'
    ,
    ' select * where { \n' +
    '    ?s  ?p ?o.\n' +
    '    ?p  rdfs:subPropertyOf :to.\n' +
    '\t?s  :isSchermata "HCL_2_LINEA_ACIDINO.txt".\n' +
    '} \n'
    ,
    ' select * where { \n' +
    '    ?s  ?p ?o.\n' +
    '    ?p  rdfs:subPropertyOf :to.\n' +
    '\t?s  :isSchermata "HCL_3_LINEA.txt".\n' +
    '} \n'
    ,
    ' select * where { \n' +
    '    ?s  ?p ?o.\n' +
    '    ?p  rdfs:subPropertyOf :to.\n' +
    '\t?s  :isSchermata "HCL_4_LINEA.txt".\n' +
    '} \n'
    ,
    ' select * where { \n' +
    '    ?s  ?p ?o.\n' +
    '    ?p  rdfs:subPropertyOf :to.\n' +
    '\t?s  :isSchermata "IMPIANTO_FeCL3_2.txt".\n' +
    '} \n'
    ,
    ' select * where { \n' +
    '    ?s  ?p ?o.\n' +
    '    ?p  rdfs:subPropertyOf :to.\n' +
    '\t?s  :isSchermata "IPOCLORITO.txt".\n' +
    '} \n'
    ,
    ' select * where { \n' +
    '    ?s  ?p ?o.\n' +
    '    ?p  rdfs:subPropertyOf :to.\n' +
    '\t?s  :isSchermata "K2CO3.txt".\n' +
    '} \n'
    ,
    ' select * where { \n' +
    '    ?s  ?p ?o.\n' +
    '    ?p  rdfs:subPropertyOf :to.\n' +
    '\t?s  :isSchermata "PREPARAZIONE_NAOH_20.txt".\n' +
    '} \n'
    ,
    ' select * where { \n' +
    '    ?s  ?p ?o.\n' +
    '    ?p  rdfs:subPropertyOf :to.\n' +
    '\t?s  :isSchermata "RECUPERO_CO2.txt".\n' +
    '} \n'
    ,
    ' select * where { \n' +
    '    ?s  ?p ?o.\n' +
    '    ?p  rdfs:subPropertyOf :to.\n' +
    '\t?s  :isSchermata "SEZIONE REAZIONE R-4003.txt".\n' +
    '} \n'
    ,
    ' select * where { \n' +
    '    ?s  ?p ?o.\n' +
    '    ?p  rdfs:subPropertyOf :to.\n' +
    '\t?s  :isSchermata "SEZIONE_REAZIONE_R-4001.txt".\n' +
    '} \n'
    ,
    ' select * where { \n' +
    '    ?s  ?p ?o.\n' +
    '    ?p  rdfs:subPropertyOf :to.\n' +
    '\t?s  :isSchermata "SEZIONE_REAZIONE_R-4002.txt".\n' +
    '} \n'
    ,
    ' select * where { \n' +
    '    ?s  ?p ?o.\n' +
    '    ?p  rdfs:subPropertyOf :to.\n' +
    '\t?s  :isSchermata "STOCCAGGIO_IPOCLORITO_DI_SODIO.txt".\n' +
    '} \n'

  ];

  constructor(private globalVariableService: GlobalVariablesService) {
  }

  ngOnInit(): void {
  }

  addNewItem(value: string) {
    this.globalVariableService.query = value;
  }


  changed(event: any) {
    this.globalVariableService.variabileListaRadiosButtonQuery = event.source.value
  }


}
