import {Injectable}
  from
    '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class EvaluateDistanceService {


  variables: any

  constructor() {
    this.mapVariables()
  }

  mapVariables() {
    // far fare poi query----- se ritorna qualcosa vuol dire che la posizione è nota
    //
    this.variables = {
      prediction: {label: 'none', impianto: ['none']},
      TemperaturareattoreR4001: {label: 'r-4001', impianto: ['R-4001']}, // nome dell'impianto come riportato nel file: collegamenti
      TemperaturareattoreR4002: {label: 'r-4002', impianto: ['R-4002']},
      TemperaturareattoreR4003: {label: 'r-4003', impianto: ['R-4003']},
      S4304: {label: 's4304exit', impianto: ['R-4001', 'R-4002', 'R-4003']},
      caricocloruroferricostandard: {label: 'not-present', impianto: ['not-present']}, //// TODO nell'excel dice che chi lo misura è FI900... Che non c'è...c'è invece TI900
      S904A: {label: 'starts-904a', impianto: ['FeCl3']},
      caricocloruroferricopotabile : {label: 'not-present', impianto: ['FeCl3']}, //trovato su excel-->FI904B // non presente su dcs
      S904B: {label: 'starts-904b', impianto: ['FeCl3']},
      S904C: {label: 'starts-904c', impianto: ['FeCl3']},
      S904D: {label: 'starts-904d', impianto: ['FeCl3']},
      S904E: {label: 'starts-904e', impianto: ['FeCl3']},
      QuantitaNaOHperBatchNaClO: {label: 'naohstart', impianto: ['Ipoclorito']}, // trovato da excel--> misuratore (FIC1702)--> nodo associato al misuratore
      QuantitaNaOHperBatchNaClO_2: {label: 'ul110', impianto: ['PreparazioneNaOH']}, // trovato da excel--> misuratore (FIC2234_1)--> nodo associato al misuratore
      ConversioneNaOH: {label: '', impianto: ['PreparazioneNaOH']},   //trovato su excel-->HC-R5001-2 --> non presente
      ConversioneKOHlinea1: {label: '', impianto: ['KOH']},//trovato su excel-->HC-R2001-2 --> non presente
      KOHrampa1caricoprodotti: {label: '', impianto: ['KOH']}, // FI801A/1
      KOHrampa2caricoprodotti: {label: '', impianto: ['KOH']},// FI801A/2
      S487: {label: 'starts-487', impianto: ['K2CO3']},
      S484: {label: 'starts-484', impianto: ['K2CO3']},
      S5104: {label: 'starts-5104', impianto: ['PreparazioneNaOH']},
      caricoiposodio: {label: 'p851b', impianto: ['StoccaggioIpoclorito']}, //Trovato su excel--> FI851
      S857: {label: 's-857', impianto: ['StoccaggioIpoclorito']}, //Trovato su excel--> FI851
      S856: {label: 's-856', impianto: ['StoccaggioIpoclorito']}, //Trovato su excel--> FI851
      S851: {label: 'exits-851', impianto: ['StoccaggioIpoclorito']},
      S852: {label: 's-852', impianto: ['StoccaggioIpoclorito']},
      S854: {label: 's-854', impianto: ['StoccaggioIpoclorito']},
      S871: {label: 'starts-871', impianto: ['HCL']},
      RedoxFeCl3Pot: {label: 'e981', impianto: ['FERRICO-FERROSO-CLORO']}, //Excel AI982
      diff_S4304: {label: 's4304-exit', impianto: [['R-4001', 'R-4002', 'R-4003']]},
      // questi dati sotto mancano nell'excel.. quindi ho messo come senza diff-- Tanto immagino saranno vicini
      diff_S904A: {label: 'starts-904a', impianto: ['FeCl3']},
      diff_S904B: {label: 'starts-904b', impianto: ['FeCl3']},
      diff_S904C: {label: 'starts-904c', impianto: ['FeCl3']},
      diff_S904D: {label: 'starts-904d', impianto: ['FeCl3']},
      diff_S904E: {label: 'starts-904e', impianto: ['FeCl3']},
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
  }
}
