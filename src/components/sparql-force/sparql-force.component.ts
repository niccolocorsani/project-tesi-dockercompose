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

declare const d3: any;

export interface Node {
  id: string;
  label: string;
  weight: number;
  type: string;
  owlClass?: boolean;
  instance?: boolean;
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

  constructor(private prefixSimplePipe: PrefixSimplePipe, private graphDBrequestService: GraphdbRequestsService, public globalVariableService: GlobalVariablesService, private router: Router, private activatedRoute: ActivatedRoute) {
  }

  async ngOnInit() {
    let rotti = this.activatedRoute.snapshot.queryParamMap.get('rotti')
    this.globalVariableService.nodiRotti = rotti.split(",");


    if (this.data) {
      this.createChart();
    }
    await this.redraw()

    await this.delay(1500)
    // let x = document.querySelector("circle").getAttribute('cx')
    // let y = document.querySelector("circle").getAttribute('cy')
    // window.scrollTo(x,y)

    // let b1 = document.getElementById('bottone1')
    //
    // b1.style.position = "absolute";
    // b1.style.left = x+'px';
    // b1.style.top = y+'px';
    //
    //
    // let b2 = document.getElementById('bottone2')

    // b2.style.position = "absolute";
    // b2.style.left = Number(x)+140+'px';
    // b2.style.top = y+30+'px';

  }


  async redraw() {
    this.globalVariableService.svgReady = true
    this.data = await this.graphDBrequestService.normalQuery()
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
      .attr('width', 5000)
      .attr('height', 5000);

    this.attachData();
  }

  @logD3()
  attachData() {
    this.force = d3.layout.force().size([5000, 5000]);

    var limit = parseInt(this.limit);
    if (this.data.length > limit) {
      var triples = this.data.slice(0, limit);
    } else {
      var triples = this.data;
    }


    if (typeof triples === 'string') {
      this._parseTriples(triples).then(d => {
        var abr = this._abbreviateTriples(d);
        this.graph = this._triplesToGraph(abr);
        this.updateChart();
      })
    } else {
      this.graph = this._triplesToGraph(triples);
      this.updateChart();
    }
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
  updateChart() {
    if (!this.svg) return;

    this.svg.append("svg:defs").selectAll("marker")
      .data(["end"])
      .enter().append("svg:marker")
      .attr("id", String)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 30)
      .attr("refY", -0.5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("svg:polyline")
      .attr("points", "0,-5 10,0 0,5");

    var links = this.svg.selectAll(".link")
      .data(this.graph.triples)
      .enter()
      .append("path")
      .attr("marker-end", "url(#end)")
      .attr("class", "link");

    var linkTexts = this.svg.selectAll(".link-text")
      .data(this.graph.triples)
      .enter()
      .append("text")
      .attr("class", "link-text")
      .text(d => d.p.label);

    var nodeTexts = this.svg.selectAll(".node-text")
      .data(this._filterNodesByType(this.graph.nodes, "node"))
      .enter()
      .append("text")
      .attr("class", "node-text")
      .text(d => d.label.replace('https://saref.etsi.org/saref4bldg/', '').replace('http://www.disit.org/saref4bldg-ext/', '')).on("click", (d) => {
        this.router.navigate([]).then(result => {
            window.open("https://log.disit.org/service/?sparql=http%3A%2F%2F192.168.1.149%3A7200%2Frepositories%2Faltair&uri=" + d.label, '_blank')
            //window.open("http://localhost:7200/graphs-visualizations?uri=" + d.label, '_blank');
          }
        );
      })
    ;

    var nodes = this.svg.selectAll(".node")
      .data(this._filterNodesByType(this.graph.nodes, "node"))
      .enter()
      .append("circle")
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
      .attr("id", d => d.label)
      .attr("r", d => {
        //MB if(d.instance || d.instSpace || d.instSpaceType){
        if (d.label.indexOf("_:") != -1) {
          return 7;
        } else if (d.instance || d.label.indexOf("inst:") != -1) {
          return 10;
        } else if (d.owlClass || d.label.indexOf("inst:") != -1) {
          return 9;
        } else {
          return 8;
        }
      })
      .on("click", (d) => {
        this.clicked(d);
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
        .attr("x", d => d.x + 12)
        .attr("y", d => d.y + 3)
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
      .charge(-500)
      .linkDistance(50)
      .start();
  }

  @logD3()
  private _filterNodesById(nodes, id) {
    return nodes.filter(n => n.id === id);
  }

  @logD3()
  private _filterNodesByType(nodes, value) {
    return nodes.filter(n => n.type === value);
  }

  @logD3()
  private _triplesToGraph(triples) {


    if (!triples) return;

    //Graph
    var graph: Graph = {nodes: [], links: [], triples: []};

    //Initial Graph from triples
    triples.forEach(triple => {

      var subjId = this.prefixSimplePipe.transform(triple.subject);
      var predId = this.prefixSimplePipe.transform(triple.predicate);
      var objId = this.prefixSimplePipe.transform(triple.object);

      // round decimal numbers to 2 decimals
      if (!isNaN(objId)) {
        objId = Number(objId) % 1 == 0 ? String(Number(objId)) : String(Number(objId).toFixed(2));
      }

      var subjNode: Node = this._filterNodesById(graph.nodes, subjId)[0];
      var objNode: Node = this._filterNodesById(graph.nodes, objId)[0];

      var predNode: Node = {id: predId, label: predId, weight: 1, type: "pred"};
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


  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }


}
