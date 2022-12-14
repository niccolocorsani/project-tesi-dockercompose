//@ts-nocheck

import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  HostListener
} from '@angular/core';
import * as N3 from 'n3';
import * as _ from 'lodash';
import * as screenfull from 'screenfull';
import * as d3_save_svg from 'd3-save-svg';
//import d3 from 'd3';

import {PrefixSimplePipe} from '../../pipes/prefix-simple.pipe';
import {GraphdbRequestsService} from "../../services/graphdb-requests.service";
import {GlobalVariablesService} from "../../services/global-variables.service";
import {ActivatedRoute, Router} from "@angular/router";
import {log, logD3} from "../../decorators/log.decorator";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ModalComponent} from "./modal-radio-button/modal.component";
import {DialogAnimationsExampleDialog} from "./modal-radio-button/dialog-animations-example";
import {MatDialog} from "@angular/material/dialog";
import {SvgRequestServiceService} from "../../services/svg-request-service.service";
import {GraphdbRequesDerviceToSpringAppService} from "../../services/graphdb-reques-dervice-to-spring-app.service";
import {HttpClient} from "@angular/common/http";

declare const d3: any;

export interface Node {
  id: string;
  label: string;
  weight: number;
  type: string;
  owlClass?: boolean;
  instance?: boolean;
  subClasses: [];
  color: 'black'
  //instSpace?: boolean; //MB
  //instSpaceType?: boolean; //MB
}

export interface Link {
  source: Node;
  target: Node;
  predicate: string;
  weight: number;
}

export interface Triples {
  s: Node;
  p: Node;
  o: Node;
}

export interface Graph {
  nodes: Node[];
  links: Link[];
  triples: Triples[];
}

@Component({
  selector: 'app-sparql-force',
  templateUrl: './sparql-force.component.html',
  styleUrls: ['./sparql-force.component.css']
})
export class SparqlForceComponent implements OnInit {


  private waitDialog = true
  private graph: Graph;
  private svg;
  private force;


  private divWidth = 10;
  private divHeight = 10;

  private limit: string = "10000";


  @ViewChild('chart') private chartContainer: ElementRef;
  @Input() public data: Array<any>;
  @Input() public height: number;
  @Output() clickedURI = new EventEmitter<string>();

  constructor(public http: HttpClient, private prefixSimplePipe: PrefixSimplePipe, private graphDBrequestService: GraphdbRequestsService, public globalVariableService: GlobalVariablesService, private router: Router, private activatedRoute: ActivatedRoute, public dialog: MatDialog, private svgRequestService: SvgRequestServiceService, private graphdbRequesDerviceToSpringAppService: GraphdbRequesDerviceToSpringAppService) {
  }

  async ngOnInit() {


    try {
      let rotti = this.activatedRoute.snapshot.queryParamMap.get('rotti')
      this.globalVariableService.nodiRotti = rotti.split(",");
    } catch (e) {
    }


    if (this.data) {
      this.createChart();
    }
    await this.redrawWithOnlySelctStatmentQuery(' select * where { \n' +
      '    ?s  ?p ?o.\n' +
      '    ?p  rdfs:subPropertyOf :to.\n' +
      '   ?s  :isSchermata "PARCO_SERBATOI_2.txt".\n' +
      '} \n')

    await this.delay(500)


  }

  async redrawWithOnlySelctStatmentQuery(query: string) {
    this.globalVariableService.svgReady = true
    await this.spinner_delay()
    this.data = await this.graphdbRequesDerviceToSpringAppService.queryReturnListOfTriples(query)
    this.createChart();

    this.cleanGraph();
    this.attachData();
    d3.selectAll("svg").remove();
    this.createChart();
    this.globalVariableService.svgReady = false
    this.globalVariableService.svgd3 = this.svg
    // if (esito === false)
    //  await this.redrawWithDifferentPredicate('select * where {' + query + '}')
  }

  async checkIfTextInDome(sostanzaCheCiDovrebbeEssere: string) {
    let tuttiPredicate = ''
    let elements = document.querySelectorAll('.link-text')
    while (elements.length === 0) {
      await this.delay(100)
      elements = document.querySelectorAll('.link-text')

    }
    elements.forEach((node) => {
      tuttiPredicate = tuttiPredicate + node.textContent
    });
    if (tuttiPredicate.includes(sostanzaCheCiDovrebbeEssere)) return true
    else return false
  }


  async redrawWithDifferentPredicate(query: string) {
    this.createChart();
    this.globalVariableService.svgReady = true
    await this.spinner_delay() ///// TODO capire perhc?? non aspetta sempre.... semplificaare il codice.... la doppia chiamata con redraw tipo sopra non serve
    this.data = await this.graphDBrequestService.queryWithSpecifiedPredicate(query)
    this.cleanGraph();
    this.attachData();
    d3.selectAll("svg").remove();
    this.createChart();
    this.globalVariableService.svgReady = false
    this.globalVariableService.svgd3 = this.svg
    await this.spinner_delay()
    let esito = await this.checkIfTextInDome(query)
    if (esito === false)
      await this.redrawWithDifferentPredicate(query)

  }

  async redrawWithModalQuery(query: string) {
    this.createChart();
    query = this.globalVariableService.variabileListaRadiosButtonQuery
    this.globalVariableService.svgReady = true
    await this.spinner_delay()
    this.data = await this.graphdbRequesDerviceToSpringAppService.queryReturnListOfTriples(query)
    await this.spinner_delay()
    this.data = await this.graphdbRequesDerviceToSpringAppService.queryReturnListOfTriples(query)  // perch?? alla prima ritorna la query fatta precedetmente
    this.cleanGraph();
    this.attachData();
    d3.selectAll("svg").remove();
    this.createChart();
    this.globalVariableService.svgReady = false
    this.globalVariableService.svgd3 = this.svg

    let esito = await this.checkIfTextInDome("to_cloro")
    await this.spinner_delay()

    // if (esito === false)
    //  await this.redrawWithDifferentPredicate('select * where {' + query + '}')
  }


  async redrawWithComplexStatment(query: string) {
    this.createChart();
    this.globalVariableService.svgReady = true
    await this.spinner_delay()
    this.data = await this.graphdbRequesDerviceToSpringAppService.queryReturnListOfTriples('select * where {' + query + '}')
    await this.spinner_delay()
    this.data = await this.graphdbRequesDerviceToSpringAppService.queryReturnListOfTriples('select * where {' + query + '}')   // perch?? alla prima ritorna la query fatta precedetmente
    this.cleanGraph();
    this.attachData();
    d3.selectAll("svg").remove();
    this.createChart();
    this.globalVariableService.svgReady = false
    this.globalVariableService.svgd3 = this.svg

    await this.spinner_delay()

    if (esito === false)
      await this.redrawWithDifferentPredicate('select * where {' + query + '}')
  }

  async redraw() {
    this.globalVariableService.svgReady = true
    this.data = await this.graphDBrequestService.normalQuery()
    await this.spinner_delay()
    this.cleanGraph();
    this.attachData();
    d3.selectAll("svg").remove();
    this.createChart();
    this.globalVariableService.svgReady = false
    this.globalVariableService.svgd3 = this.svg
  }

  // Redraw on resize
  @HostListener('window:resize') onResize() {
    d3.selectAll("svg").remove();
    this.createChart();
  }

  // Resize on scroll
  @HostListener('mousewheel', ['$event']) onScroll(ev) {
    var delta = Math.max(-1, Math.min(1, (ev.wheelDelta || -ev.detail)));
    if (delta > 0) {
      // console.log("zoom in");
    } else if (delta < 0) {
      //  console.log("zoom out");
    }
  }

  @logD3()
  saveSVG() {
    var config = {
      filename: 'd3-svg',
    }
    d3_save_svg.save(d3.select('svg').node(), config);
  }

  @logD3()
  createChart() {
    const element = this.chartContainer.nativeElement;
    if (!this.divWidth) this.divWidth = element.clientWidth;
    if (!this.divHeight) this.divHeight = element.clientHeight;
    this.svg = d3.select(element).append('svg')
      .attr('width', 20000)
      .attr('height', 20000);
    this.attachData();
  }

  @logD3()
  attachData() {
    this.force = d3.layout.force().size([20000, 20000]);

    var limit = parseInt(this.limit);
    if (this.data.length > limit) {
      var triples = this.data.slice(0, limit);
    } else {
      var triples = this.data;
    }


    if (typeof triples === 'string') {
      this._parseTriples(triples).then(d => {
        var abr = this._abbreviateTriples(d);
        //TODO aggiunto if sotto di recente, riguardare
        //if(!Object(this.graph).hasOwnProperty('triples'))
        this.graph = this._triplesToGraph(abr);
        this.updateChart();
      })
    } else {
      //TODO aggiunto if sotto di recente, riguardare
      //if(!Object(this.graph).hasOwnProperty('triples'))    Dal momento che fa tutti gli update quando vengono collegati i colori ritorna black.....
      this.graph = this._triplesToGraph(triples);
      this.updateChart();
    }
  }


  @logD3()
  private _triplesToGraph(triples) {


    if (!triples) return;

    //Graph
    var graph: Graph = {nodes: [], links: [], triples: []};

    //Initial Graph from triples
    triples.forEach(async triple => {

      var subjId = this.prefixSimplePipe.transform(triple.subject);
      var predId = this.prefixSimplePipe.transform(triple.predicate);
      var objId = this.prefixSimplePipe.transform(triple.object);

      // round decimal numbers to 2 decimals
      if (!isNaN(objId)) {
        objId = Number(objId) % 1 == 0 ? String(Number(objId)) : String(Number(objId).toFixed(2));
      }

      var subjNode: Node = this._filterNodesById(graph.nodes, subjId)[0];
      var objNode: Node = this._filterNodesById(graph.nodes, objId)[0];


      /*
            let queryFerroso = "select * where {<"+subjId+"> ?p <"+objId+">.}"
            console.log(queryFerroso)
            let queryResult = await this.graphdbRequesDerviceToSpringAppService.normalQuery(queryFerroso)
            await this.delay(100)

            console.log(queryResult)

      */

      var predNode: Node = {id: predId, label: predId, weight: 1, type: "pred", color: 'black'};
      graph.nodes.push(predNode);

      if (subjNode == null) {
        subjNode = {id: subjId, label: subjId, weight: 1, type: "node"};

        //TODO check


        graph.nodes.push(subjNode);
      }

      if (objNode == null) {
        objNode = {id: objId, label: objId, weight: 1, type: "node"};
        if (predNode.label == "rdf:type" || predNode.label == "http://www.w3.org/1999/02/22-rdf-syntax-ns#type") {
          objNode.owlClass = true;
          subjNode.instance = true;
        }
        graph.nodes.push(objNode);
      }

      var blankLabel = "";

      graph.links.push({source: subjNode, target: predNode, predicate: blankLabel, weight: 1});
      graph.links.push({source: predNode, target: objNode, predicate: blankLabel, weight: 1});


      graph.triples.push({s: subjNode, p: predNode, o: objNode});


    });


    graph.nodes.forEach(node => {
      if (this.globalVariableService.nodiRotti[0] != '') {
        this.globalVariableService.nodiRotti.forEach(value => {
          if (value != 'KOHrampa1caricoprodotti' && value != 'prediction' && value != 'KOHrampa2caricoprodotti' && value != 'ConversioneNaOH' && value != 'ConversioneKOHlinea1') {
            if (node.id.includes(this.globalVariableService.variables[value].label)) {
              node.instance = true;
            }
          }
        })
      }
    })


    return graph;
  }

  @logD3()
  private _parseTriples(triples) {
    // ParseTriples
    var parser = N3.Parser();
    var jsonTriples = [];
    return new Promise((resolve, reject) => {
        parser.parse(triples, (err, triple, prefixes) => {
          if (triple) {
            jsonTriples.push(triple);
          } else {
            resolve({triples: jsonTriples, prefixes: prefixes});
          }
          if (err) {
            reject(err);
          }
        });
      }
    );
  }

  @logD3()
  private _abbreviateTriples(data) {

    var prefixes = data.prefixes;
    var triples = [];

    function abbreviate(foi) {
      var newVal = null;
      // If FoI has 'http' in its name, continue
      if (foi.indexOf('http') !== -1) {
        // Loop over prefixes
        _.each(prefixes, (val, key) => {
          // If the FoI has the prefixed namespace in its name, return it
          if (foi.indexOf(val) !== -1) {
            newVal = foi.replace(val, key + ':');
          }
        })
      }
      return newVal;

    }

    _.each(data.triples, d => {
      var s = d.subject;
      var p = d.predicate;
      var o = d.object;

      if (abbreviate(s) != null) s = abbreviate(s);
      if (abbreviate(p) != null) p = abbreviate(p);
      if (abbreviate(o) != null) o = abbreviate(o);
      triples.push({subject: s, predicate: p, object: o})
    });
    return triples;
  }


  firstPressed = ''
  secondPressed = ''

  @logD3()
  updateChart() {
    if (!this.svg) return;

    this.svg.append("svg:defs").selectAll("marker")
      .data(["end"])
      .enter().append("svg:marker")
      .attr("id", String)
      .attr("viewBox", "0 -5 20 20")
      .attr("refX", 30)
      .attr("refY", -0.5)
      .attr("markerWidth", 20)
      .attr("markerHeight", 20)
      .attr("orient", "auto")
      .append("svg:polyline")
      .attr("points", "0,-5 10,0 0,5");


    // vecchio
    /*.attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 30)
    .attr("refY", -0.5)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("svg:polyline")
    .attr("points", "0,-5 10,0 0,5");*/


    var links = this.svg.selectAll(".link")
      .data(this.graph.triples)
      .enter()
      .append("path")
      .attr("marker-end", "url(#end)")
      .style("stroke", (d) => {

        if (d.p.label.includes('cloro')) return '#FFEA00'
        if (d.p.label.includes('CloroParaffine')) return '#fafa8c'
        if (d.p.label.includes('ferroso')) return '#07e512'
        if (d.p.label.includes('cloruroFerrico')) return '#e50707'
        if (d.p.label.includes('cl2')) return '#FFEA00'
        if (d.p.label.includes('hcl')) return '#FF8000'
        if (d.p.label.includes('IpocloritoDiSodio')) return '#e7d496'
        if (d.p.label.includes('NaOH24')) return '#dd9ce8'
        if (d.p.label.includes('Sfiati')) return '#030101'
        if (d.p.label.includes('k2co3')) return '#880fff'



        if (d.p.label != 'http://www.disit.org/saref4bldg-ext/to') {
          return '#0418ee'
        }

        //d.p.color
      })
      .attr("class", "link")


    var linkTexts = this.svg.selectAll(".link-text")
      .data(this.graph.triples)
      .enter()
      .append("text")
      .attr("class", "link-text")
      .text(d => d.p.label.replace('http://www.disit.org/saref4bldg-ext/', '')).on("click", async (d) => {


        let queryScheramta = "select * where {<" + d.s.label + "> :isSchermata ?o.}"
        let queryResultSchermata = await this.graphdbRequesDerviceToSpringAppService.normalQuery(queryScheramta)
        this.globalVariableService.currentSelectedShermataElement = queryResultSchermata

        this.globalVariableService.current_selected_D = d
        await this.openDialogSync()

        if (this.globalVariableService.variabileDelModalRadio == '') // se non ?? stato cliccato nulla
          return

        let query = "select * where {<" + d.s.label + "> :isSchermata ?o.}"

        await this.delay(1000)
        let queryResult = await this.graphdbRequesDerviceToSpringAppService.normalQuery(query)


        while (queryResult.length > 4 || this.globalVariableService.schermataCheRitornaLaQueryMale.length == 0) { // questo while va fatto perch?? se no ritorna valori strani
          await this.delay(1000)
          await this.graphdbRequesDerviceToSpringAppService.normalQuery(query)
          if (this.globalVariableService.schermataCheRitornaLaQueryMale.length > 0)
            queryResult = this.globalVariableService.schermataCheRitornaLaQueryMale

        }


        let schermata = queryResult[0][0].split(":")[1].split("^")[0].replace("\"", "").replace("\"", "").replace(".txt", "")
        let infoDaAggiungereAlCSV = d.s.label.replace('http://www.disit.org/altair/resource/', '') + ';ObjectProperty;' + this.globalVariableService.variabileDelModalRadio + ';' + d.o.label.replace('http://www.disit.org/altair/resource/', '')

        let foo = confirm('aggiunto:    ' + d.s.label.replace("http://www.disit.org/altair/resource/", "") + '    ' + this.globalVariableService.variabileDelModalRadio + '     ' + d.o.label.replace("http://www.disit.org/altair/resource/", ""));

        if (foo === false) {
          this.globalVariableService.variabileDelModalRadio = ''
          return
        }
        alert("aggiunta sostanza con successo")


        await this.svgRequestService.addInfoToCSV(infoDaAggiungereAlCSV, schermata)
        this.globalVariableService.variabileDelModalRadio = ''

        // let foo = prompt('Type here');
        //console.log(foo, bar);
      });

    var nodeTexts = this.svg.selectAll(".node-text")
      .data(this._filterNodesByType(this.graph.nodes, "node"))
      .enter()
      .append("text")
      .attr("class", "node-text")
      .text(d => d.label.replace('https://saref.etsi.org/saref4bldg/', '').replace('http://www.disit.org/altair/resource/', '')).on("click", (d) => {
        this.router.navigate([]).then(result => {
             //window.open("https://log.disit.org/service/?sparql=http%3A%2F%2F192.168.1.149%3A7200%2Frepositories%2Faltair&uri=" + d.label, '_blank')
             window.open("http://localhost:7200/graphs-visualizations?uri=" + d.label, '_blank');
          }
        );
      })
    ;

    var nodes = this.svg.selectAll(".node")
      .data(this._filterNodesByType(this.graph.nodes, "node"))
      .enter()
      .append("" +
        "circle")
      .attr("class", d => {
        if (d.owlClass) {
          return "class"
        } else if (d.label.indexOf("_:") != -1) {
          return "blank"
        } else if (d.instance || d.label.indexOf("inst:") != -1) {
          return "instance"
        } else {
          return "node"
        }
      })


      .attr("id", d => d.label.replace('http://www.disit.org/altair/resource/', ''))
      .attr("r", 24)
      .on("click", async (d) => {
        d3.select("#" + d.label.replace('http://www.disit.org/altair/resource/', '')).style("fill", "black");


        if (this.firstPressed != '')
          this.secondPressed = d.label
        else
          this.firstPressed = d.label


        if (this.firstPressed == '' || this.secondPressed == '') {
          //// TODO da finire
          return
        } else {
          let foo = confirm('Crea percorso ?');
          if (foo === false) {
            this.secondPressed = ''
            this.firstPressed = ''
            return
          }
        }

        //// Questa ?? la miglior soluzione lo legge benissimo   https://meyerweb.com/eric/tools/dencoder/


        let allPath = await this.graphdbRequesDerviceToSpringAppService.normalQuery('SELECT%20%3Fstart%20%3Fend%20%3Findex%20%3Fpath%0A%20%20%20%20%20%20%20%20WHERE%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20VALUES%20(%3Fsrc%20%3Fdst)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20(%20<' + this.firstPressed + '>%20<' + this.secondPressed + '>%20)%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20SERVICE%20%3Chttp%3A%2F%2Fwww.ontotext.com%2Fpath%23search%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Curn%3Apath%3E%20path%3AfindPath%20path%3AshortestPath%20%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20path%3AsourceNode%20%3Fsrc%20%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20path%3AdestinationNode%20%3Fdst%20%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20path%3ApathIndex%20%3Fpath%20%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20path%3AstartNode%20%3Fstart%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20path%3AendNode%20%3Fend%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20path%3AmaxPathLength%2030%20%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20path%3AresultBindingIndex%20%3Findex%20.%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20SERVICE%20%3Curn%3Apath%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Fstart%20%3Ato%20%3Fend%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%0A%7D')
        await this.spinner_delay()
        allPath = await this.graphdbRequesDerviceToSpringAppService.normalQuery('SELECT%20%3Fstart%20%3Fend%20%3Findex%20%3Fpath%0A%20%20%20%20%20%20%20%20WHERE%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20VALUES%20(%3Fsrc%20%3Fdst)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20(%20<' + this.firstPressed + '>%20<' + this.secondPressed + '>%20)%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20SERVICE%20%3Chttp%3A%2F%2Fwww.ontotext.com%2Fpath%23search%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Curn%3Apath%3E%20path%3AfindPath%20path%3AshortestPath%20%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20path%3AsourceNode%20%3Fsrc%20%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20path%3AdestinationNode%20%3Fdst%20%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20path%3ApathIndex%20%3Fpath%20%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20path%3AstartNode%20%3Fstart%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20path%3AendNode%20%3Fend%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20path%3AmaxPathLength%2030%20%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20path%3AresultBindingIndex%20%3Findex%20.%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20SERVICE%20%3Curn%3Apath%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Fstart%20%3Ato%20%3Fend%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%0A%7D')


        await this.openDialogSync()

        var listOfStringCSV = []
        var start
        var end
        allPath.forEach(value => {
          start = value[0].replace('start:', '')
          end = value[1].replace('end:', '')
          d3.select("#" + start.replace('http://www.disit.org/altair/resource/', '')).style("fill", "green");
          d3.select("#" + end.replace('http://www.disit.org/altair/resource/', '')).style("fill", "green");
          listOfStringCSV.push(start.replace('http://www.disit.org/altair/resource/', '') + ';ObjectProperty;' + this.globalVariableService.variabileDelModalRadio + ';' + end.replace('http://www.disit.org/altair/resource/', ''))
        })


        this.globalVariableService.variabileDelModalRadio = ''



          // o:"PARCO_SERBATOI_2.txt"^^<http://www.w3.org/2001/XMLSchema#string>


        let schermata = await this.getCurrentClickedSchermata(start)

        for (const value of listOfStringCSV) {
          alert('aggiungo: ' + value + '\nschermata : ' + schermata)
          await this.svgRequestService.addInfoToCSV(value, schermata)
        }


        this.firstPressed = ''
        this.secondPressed = ''


      })
      .call(this.force.drag);//nodes


    // ==================== When dragging ====================
    this.force.on("tick", () => {
      nodes
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

      links
        .attr("d", function (d) {
          return "M" + d.s.x + "," + d.s.y
            + "S" + d.p.x + "," + d.p.y
            + " " + d.o.x + "," + d.o.y;
        })
      ;

      nodeTexts
        .attr("x", d => d.x + 20)
        .attr("y", d => d.y + 8)
      ;


      linkTexts
        .attr("x", d => {
          return 4 + (d.s.x + d.p.x + d.o.x) / 3;
        })
        .attr("y", d => {
          return 4 + (d.s.y + d.p.y + d.o.y) / 3;
        })
      ;
    });


    // ==================== Run ====================
    this.force
      .nodes(this.graph.nodes)
      .links(this.graph.links)
      .charge(-5000)
      .linkDistance(20)
      .start();

    //// TODO da scrivere in tesi, vincolando al minimo la distanza dei link tra nodi e mettendo al massimo la carica di repulsione elettromagnetica ottengo il comportamento di separazione delle schermate  perfetto


    ///// Per trascinare i nodi e fixarli nella posizione selezionata
    var dragstart = function (d) {
      d.fixed = true;
    };
    var drag = this.force.drag().on("dragstart", dragstart);
  }

  ///// Per trascinare i nodi e fixarli nella posizione selezionata


  async updateColors() {

    for (let element: Triples in this.graph.triples) { //// N.B. ricordarsi che il for posto in questa maniera fa si che con l'await sia tutto sincrono con il .forEach(value) ?? tutto mega asincrono
      let queryCloro = "select * where {<" + this.graph.triples[element].s.label + "> :to_cloro ?o.}"
      let queryResult = await this.graphdbRequesDerviceToSpringAppService.normalQuery(queryCloro)
      //// questi if non bastano......va messo queryResult.length != 0 && queryResult o == d.o
      if (queryResult.length != 0) {
        this.graph.triples[element].p.color = 'yellow'
      }
      let queryCloruroFerrico = "select * where {<" + this.graph.triples[element].s.label + "> :to_cloruro_ferrico ?o.}"
      queryResult = await this.graphdbRequesDerviceToSpringAppService.normalQuery(queryCloruroFerrico)
      if (queryResult.length != 0) {
        this.graph.triples[element].p.color = 'red'
      }
      let queryFerroso = "select * where {<" + this.graph.triples[element].s.label + "> :to_ferroso ?o.}"
      queryResult = await this.graphdbRequesDerviceToSpringAppService.normalQuery(queryFerroso)
      if (queryResult.length != 0) {
        this.graph.triples[element].p.color = 'green'
      }
    }

    d3.selectAll("svg").remove();
    this.createChart();
    this.graph.nodes.forEach(triple => console.log(triple.p.color))
    this.globalVariableService.svgReady = false
    this.graph.nodes.forEach(triple => console.log(triple.p.color))
    this.globalVariableService.svgd3 = this.svg
    this.graph.nodes.forEach(triple => console.log(triple.p.color))
  }

  @logD3()
  public clicked(d) {
    if (d3.event.defaultPrevented) return; // dragged
    this.clickedURI.emit(d);
  }

  @logD3()
  cleanGraph() {
    // Remove everything below the SVG element
    d3.selectAll("svg > *").remove();
  }

  @logD3()
  private _filterNodesById(nodes, id) {
    return nodes.filter(n => n.id === id);
  }

  @logD3()
  private _filterNodesByType(nodes, value) {
    return nodes.filter(n => n.type === value);
  }


  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }


  openDialog(): void {
    this.dialog.open(DialogAnimationsExampleDialog, {
      width: '250px'
    });
  }

  async riaggiornaGrafoConColori() { // con sto servizio aggiorno l'ontologia su graphDB eliminando quella precedente e mettendone una nuova
    let schermate = ['CARICO_FERRICO_FERROSO.csv', 'CARICO_FERRICO_FERROSO_2.csv', 'FERRICO_FERROSO_CLORO_FERRO.csv', 'HCL_1_LINEA_(FG600).csv', 'HCL_2_LINEA_ACIDINO.csv', 'HCL_3_LINEA.csv', 'HCL_4_LINEA.csv', 'IMPIANTO_FeCL3_2.csv', 'IPOCLORITO.csv', 'K2CO3.csv', 'PARCO_SERBATOI_2.csv', 'PREPARAZIONE_NAOH_20.csv', 'RECUPERO_CO2.csv', 'SEZIONE_REAZIONE_R-4003.csv', 'SEZIONE_REAZIONE_R-4001.csv', 'SEZIONE_REAZIONE_R-4002.csv', 'STOCCAGGIO.csv', 'STOCCAGGIO_IPOCLORITO_DI_SODIO.csv']
    // let schermate = ['IMPIANTO_FeCL3_2.csv', 'CARICO_FERRICO_FERROSO.csv', 'CARICO_FERRICO_FERROSO_2.csv', 'HCL_1_LINEA_(FG600).csv', 'HCL_2_LINEA_ACIDINO.csv', 'HCL_3_LINEA.csv', 'HCL_4_LINEA.csv', 'PARCO_SERBATOI_2.csv', 'STOCCAGGIO_IPOCLORITO_DI_SODIO.csv']
    let svg = await this.svgRequestService.getSVG(this.overSogliaListXristrette, schermate)
    await this.delay(1000)
    this.cleanGraph()
    await this.redraw()
  }



  async aggiornaOntlogiaConProprietaSeparate() { // con sto servizio aggiorno l'ontologia su graphDB eliminando quella precedente e mettendone una nuova
    let schermate = ['CARICO_FERRICO_FERROSO.csv', 'CARICO_FERRICO_FERROSO_2.csv', 'FERRICO_FERROSO_CLORO_FERRO.csv', 'HCL_1_LINEA_(FG600).csv', 'HCL_2_LINEA_ACIDINO.csv', 'HCL_3_LINEA.csv', 'HCL_4_LINEA.csv', 'IMPIANTO_FeCL3_2.csv', 'IPOCLORITO.csv', 'K2CO3.csv', 'PARCO_SERBATOI_2.csv', 'PREPARAZIONE_NAOH_20.csv', 'RECUPERO_CO2.csv', 'SEZIONE_REAZIONE_R-4003.csv', 'SEZIONE_REAZIONE_R-4001.csv', 'SEZIONE_REAZIONE_R-4002.csv', 'STOCCAGGIO.csv', 'STOCCAGGIO_IPOCLORITO_DI_SODIO.csv']
    // let schermate = ['IMPIANTO_FeCL3_2.csv', 'CARICO_FERRICO_FERROSO.csv', 'CARICO_FERRICO_FERROSO_2.csv', 'HCL_1_LINEA_(FG600).csv', 'HCL_2_LINEA_ACIDINO.csv', 'HCL_3_LINEA.csv', 'HCL_4_LINEA.csv', 'PARCO_SERBATOI_2.csv', 'STOCCAGGIO_IPOCLORITO_DI_SODIO.csv']
    let svg = await this.svgRequestService.getSVGProprietaSeparate(this.overSogliaListXristrette, schermate)
    await this.delay(1000)
    this.cleanGraph()
    await this.redraw()
  }

  dialogRef

  async openDialogSync(): Promise<number> {
    this.dialogRef = this.dialog.open(DialogAnimationsExampleDialog, {
      width: "500px",

    });


    return this.dialogRef.afterClosed()
      .toPromise() // here you have a Promise instead an Observable
      .then(result => {
        this.waitDialog = false
        return Promise.resolve(result); // will return a Promise here
      });
  }

  posizionaSuGrafo() {

    let x = document.querySelector("circle").getAttribute('cx')
    let y = document.querySelector("circle").getAttribute('cy')
    window.scrollTo(x, y)

  }


  async spinner_delay() {
    this.globalVariableService.spinner = true
    await this.delay(4000)
    this.globalVariableService.spinner = false
  }


  scale(scaleFactor: any) {
    let val = document.getElementById('valore-scalatura-svg').value
    document.getElementById('svg-body').style.transform = 'scale(' + val + ')';
  }


  scaleWithArgument(scaleFactor: any) {
    document.getElementById('svg-body').style.transform = 'scale(' + scaleFactor + ')';
  }


  async getCurrentClickedSchermata(iri: string) {


    let queryScheramta = "select * where {<" + iri + "> :isSchermata ?o.}"
    let queryResultSchermata = await this.graphdbRequesDerviceToSpringAppService.normalQuery(queryScheramta)
    this.globalVariableService.currentSelectedShermataElement = queryResultSchermata


    let schermata = this.globalVariableService.schermataCheRitornaLaQueryMale


    await this.spinner_delay()

    queryResultSchermata = await this.graphdbRequesDerviceToSpringAppService.normalQuery(queryScheramta)
    this.globalVariableService.currentSelectedShermataElement = queryResultSchermata


    schermata = this.globalVariableService.schermataCheRitornaLaQueryMale



    return this.globalVariableService.schermataCheRitornaLaQueryMale[0][0].split(":")[1].split("^")[0].replace("\"", "").replace("\"", "").replace(".txt", "")


  }
}
