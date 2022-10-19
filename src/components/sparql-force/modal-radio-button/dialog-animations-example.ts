import {Component} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {GlobalVariablesService} from "../../../services/global-variables.service";
import {MatCheckboxChange} from "@angular/material/checkbox";
import {SvgRequestServiceService} from "../../../services/svg-request-service.service";

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


  listOfObjectProperties = ['to_ferroso', 'to_ferrosoPotabile', 'to_cloro', 'to_cloruroFerrico', 'to_CloroParaffine', 'to_n2', 'to_cw', 'to_hcl', 'to_acquaDemineralizzata', 'to_aria', 'to_aw', 'to_ariaAtmosferica', 'to_h2', 'to_ariaFalsa', 'to_IpocloritoDiSodio', 'to_k2co3', 'to_CloroparaffinaConVariGradiDiClorurazione', 'to_ParaffinaACatenaMedia', 'to_ParaffinaACatenaLunga', 'to_ParaffinaACatenaLunghissima', 'to_Sfiati', 'to_AcquaDiRecupero', 'to_FanghiFiltroFunda', 'to_AcquaDiRicicloColonna', 'to_AcquaDiCondense','to_acquaDiTorre', 'to_FumiDaCogenerazione', 'to_vapore','to_vaporeBassaPressione', 'to_K2CO3al45PerCento', 'to_NaOH', 'to_vb', 'to_ai', 'to_cwr', 'to_atm', 'to_NaOH24', 'to_GasScarico', 'to_h2oCalda','to_HCL32', 'to_fanghiFiltroFunda', 'to_KOH', 'to_metano','to_fumi'] //l'underScore va messo con prudenza in quanto nel back end, serve a delineare una subProperty

  constructor(public dialogRef: MatDialogRef<DialogAnimationsExampleDialog>, private globalVariableService: GlobalVariablesService , private svgRequestService : SvgRequestServiceService) {

  }


  ngOnInit() {
    // will log the entire data object
  }


  changed(event: MatCheckboxChange) {
    if (this.globalVariableService.variabileDelModalRadio != '')
      this.globalVariableService.variabileDelModalRadio = this.globalVariableService.variabileDelModalRadio + '-' + event.source.value
    else
      this.globalVariableService.variabileDelModalRadio = event.source.value
    console.log(this.globalVariableService.variabileDelModalRadio)
  }

  async eliminaObjectProperty() {
    let daEliminare = this.globalVariableService.current_selected_D.s.label.replace('http://www.disit.org/altair/resource/', '') + ';ObjectProperty;' + this.globalVariableService.current_selected_D.p.label.replace('http://www.disit.org/saref4bldg-ext/', '') + ';' + this.globalVariableService.current_selected_D.o.label.replace('http://www.disit.org/altair/resource/', '')

    let nomeSchermata = this.globalVariableService.schermataCheRitornaLaQueryMale.toString().split(":")[1].split("^")[0].replace("\"", "").replace("\"", "").replace(".txt", "")


    alert('elimino: ' + daEliminare + 'nomeSchermata ' + nomeSchermata)

    alert(nomeSchermata)

    await this.svgRequestService.eliminaInfoDalCSV(daEliminare, nomeSchermata)


  }
}


/**  Copyright 2022 Google LLC. All Rights Reserved.
 Use of this source code is governed by an MIT-style license that
 can be found in the LICENSE file at https://angular.io/license */
