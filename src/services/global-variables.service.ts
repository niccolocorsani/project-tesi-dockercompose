import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalVariablesService {


  schermataCheRitornaLaQueryMale = ''



  svgReady = false
  nodiRotti = [];
  svgd3 = '';
  spinner= false;
  query = ''
  variabileListaRadiosButtonQuery = '';

  current_selected_D : any;



  variabileDelModalRadio = ''

  variables = {
    prediction: {label: 'none', impianto: ['none']},

    RedoxFeCl3Pot: {label: 'e981', impianto: ['FERRICO-FERROSO-CLORO']}, //Ben identificato Excel AI982
    S904A: {label: 's-904a', impianto: ['CARICO-FERRICO-FERROSO2']},
    S904B: {label: 's-904b ', impianto: ['CARICO-FERRICO-FERROSO2']},// Ben
    S904C: {label: 's-904c', impianto: ['CARICO-FERRICO-FERROSO2']}, // Presente solo in stoccaggio
    caricocloruroferricostandard: {label: 'p904a', impianto: ['CARICO-FERRICO-FERROSO2']}, // Ben Identificato  il sensore che lo misura è FI900
    caricocloruroferricopotabile: {label: 'p904b', impianto: ['CARICO-FERRICO-FERROSO']}, // Ben Identificato  Identificato
    S904D: {label: 's-904d', impianto: ['CARICO-FERRICO-FERROSO']},// Ben Identificato  Identificato
    S904E: {label: 's-904e', impianto: ['CARICO-FERRICO-FERROSO']},// Ben Identificato  Identificato

    TemperaturareattoreR4001: {label: 'r-4001', impianto: ['R-4001']},// Ben Identificato
    TemperaturareattoreR4002: {label: 'r-4002', impianto: ['R-4002']}, // Ben Identificato
    TemperaturareattoreR4003: {label: 'r-4003', impianto: ['R-4003']}, // Ben Identificato
    S4304: {label: 's4304exit', impianto: ['R-4001', 'R-4002', 'R-4003']}, // Ben Identificato
    QuantitaNaOHperBatchNaClO: {label: 'naohstart', impianto: ['Ipoclorito']}, // Ben Identificato
    // trovato da excel--> misuratore FIC1702
    QuantitaNaOHperBatchNaClO_2: {label: 'ul110', impianto: ['PreparazioneNaOH']},// Ben Identificato
    // trovato da excel--> misuratore FIC2234_1


    ConversioneNaOH: {label: '', impianto: ['PreparazioneNaOH']}, //trovato su excel-->HC-R5001
    ConversioneKOHlinea1: {label: '', impianto: ['KOH']},//trovato su excel-->HC-R2001


    KOHrampa1caricoprodotti: {label: '', impianto: ['KOH']},// trovato su excel--> FI801A/1 2 --> non presente su dcs
    KOHrampa2caricoprodotti: {label: '', impianto: ['KOH']},// trovato su excel--> FI801A/2 2 --> non presente su dcs


    S487: {label: 'starts-487', impianto: ['K2CO3']}, // Presente solo in stoccaggio
    S484: {label: 'starts-484', impianto: ['K2CO3']}, // Presente solo in stoccaggio
    S5104: {label: 'starts-5104', impianto: ['PreparazioneNaOH']}, // Presente solo in stoccaggio
    S871: {label: 'starts-871', impianto: ['HCL']}, //Presente solo in stoccaggio


    caricoiposodio: {label: 'p851b', impianto: ['StoccaggioIpoclorito']},// Ben Identificato excel--> FI851
    S857: {label: 's-857', impianto: ['StoccaggioIpoclorito']}, //Ben identificato
    S856: {label: 's-856', impianto: ['StoccaggioIpoclorito']}, //Ben identificato
    S851: {label: 'exits-851', impianto: ['StoccaggioIpoclorito']},//Ben identificato
    S852: {label: 's-852', impianto: ['StoccaggioIpoclorito']}, //Ben identificato
    S854: {label: 's-854', impianto: ['StoccaggioIpoclorito']}, //Ben identificato


// Da aggiornare
    diff_S4304: {label: 's4304-exit', impianto: [['R-4001', 'R-4002', 'R-4003']]},
    diff_S904A: {label: 's-904a', impianto: ['CARICO-FERRICO-FERROSO2']},
    diff_S904B: {label: 's-904b', impianto: ['CARICO-FERRICO-FERROSO2']},
    diff_S904C: {label: 's-904c', impianto: ['CARICO-FERRICO-FERROSO2']},
    diff_S904D: {label: 's-904d', impianto: ['CARICO-FERRICO-FERROSO']},
    diff_S904E: {label: 's-904e', impianto: ['CARICO-FERRICO-FERROSO']},
    diff_S487: {label: 'starts-487', impianto: ['K2CO3']},
    diff_S484: {label: 'starts-484', impianto: ['K2CO3']},
    diff_S5104: {label: 'starts-5104', impianto: ['PreparazioneNaOH']},
    diff_S857: {label: 's-857', impianto: ['StoccaggioIpoclorito']},
    diff_S856: {label: 's-856', impianto: ['StoccaggioIpoclorito']},
    diff_S851: {label: 'exits-851', impianto: ['StoccaggioIpoclorito']},
    diff_S852: {label: 's-852', impianto: ['StoccaggioIpoclorito']},
    diff_S854: {label: 's-854', impianto: ['StoccaggioIpoclorito']},
    diff_S871: {label: 'starts-871', impianto: ['HCL1']}

  }

  constructor() {
  }
}
