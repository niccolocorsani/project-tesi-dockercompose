import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {GlobalVariablesService} from "../../../services/global-variables.service";
import {MatCheckboxChange} from "@angular/material/checkbox";

/**
 * @title Dialog Animations
 */
@Component({
  selector: 'dialog-animations-example',
  styleUrls: ['dialog-animations-example.css'],
  templateUrl: 'dialog-animations-example.html',
})
export class DialogAnimationsExample {
  constructor(public dialog: MatDialog) {
  }

  openDialog(): void {
    this.dialog.open(DialogAnimationsExampleDialog, {
      width: '250px'

    });
  }
}

@Component({
  selector: 'dialog-animations-example-dialog',
  templateUrl: 'dialog-animations-example-dialog.html',
})
export class DialogAnimationsExampleDialog {


  listOfObjectProperties = ['to_ferroso','to_ferrosoPotabile','to_cloro','to_cloruroFerrico','to_CloroParaffine','to_n2','to_cw','to_hcl','to_acquaDemineralizzata','to_aria','to_aw','to_ariaAtmosferica','to_h2','to_ariaFalsa','to_IpocloritoDiSodio','to_k2co3','to_CloroparaffinaConVariGradiDiClorurazione','to_ParaffinaACatenaMedia','to_ParaffinaACatenaLunga','to_ParaffinaACatenaLunghissima','to_Sfiati','to_AcquaDiRecupero','to_FanghiFiltroFunda','to_AcquaDiRicicloColonna','to_AcquaDiCondense','to_FumiDaCogenerazione','to_vapore','to_K2CO3al45PerCento','to_NaOH', 'to_vb','to_ai','to_cwr','to_atm','to_NaOH24','to_GasScarico'] //l'underScore va messo con prudenza in quanto nel back end, serve a delineare una subProperty

  constructor(public dialogRef: MatDialogRef<DialogAnimationsExampleDialog>, private globalVariableService: GlobalVariablesService) {
  }


  changed(event:MatCheckboxChange) {
    if(this.globalVariableService.variabileDelModalRadio != '')
    this.globalVariableService.variabileDelModalRadio = this.globalVariableService.variabileDelModalRadio + '-'+event.source.value
    else
      this.globalVariableService.variabileDelModalRadio = event.source.value
    console.log(this.globalVariableService.variabileDelModalRadio)
  }
}


/**  Copyright 2022 Google LLC. All Rights Reserved.
 Use of this source code is governed by an MIT-style license that
 can be found in the LICENSE file at https://angular.io/license */
