import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {SparqlForceComponent} from "../components/sparql-force/sparql-force.component";
import {PrefixSimplePipe} from "../pipes/prefix-simple.pipe";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";

@NgModule({
  declarations: [
    AppComponent,
    SparqlForceComponent,
    PrefixSimplePipe,


  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatOptionModule,
    MatSelectModule,

  ],
  providers: [PrefixSimplePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
