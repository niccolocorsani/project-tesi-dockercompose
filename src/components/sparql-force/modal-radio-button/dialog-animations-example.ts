import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {GlobalVariablesService} from "../../../services/global-variables.service";

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


  listOfObjectProperties = ['to_ferroso','to_cloro','to_cloro_ferrico']

  constructor(public dialogRef: MatDialogRef<DialogAnimationsExampleDialog>, private globalVariableService: GlobalVariablesService) {
  }



  changed(event: any) {
    this.globalVariableService.variabileDelModalRadio = event.value
  }


}


/**  Copyright 2022 Google LLC. All Rights Reserved.
 Use of this source code is governed by an MIT-style license that
 can be found in the LICENSE file at https://angular.io/license */
