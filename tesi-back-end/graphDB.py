from SPARQLWrapper import SPARQLWrapper, JSON
import os

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def get_distance_property_path(node1, node2):
    sparql = SPARQLWrapper("http://localhost:7200/repositories/altair")
    sparql.setQuery("""PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    PREFIX : <http://www.disit.org/saref4bldg-ext/>
    PREFIX s: <https://saref.etsi.org/saref4bldg/>
    PREFIX c: <https://saref.etsi.org/core/>
    SELECT *{
       s:""" + node1 + """ :to+ ?x.
       ?x :to+ s:""" + node2 + """
    }
     """)

    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()

    print('---------------------------')

    for result in results["results"]["bindings"]:
        print((result["x"]["value"]))


def get_distance_graphdb_path(node1, node2):
    sparql = SPARQLWrapper("http://localhost:7200/repositories/altair")
    sparql.setQuery("""PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        PREFIX : <http://www.disit.org/saref4bldg-ext/>
        PREFIX s: <https://saref.etsi.org/saref4bldg/>
        PREFIX c: <https://saref.etsi.org/core/>
        PREFIX path: <http://www.ontotext.com/path#>
        SELECT ?start ?end ?index ?path
        WHERE {
            VALUES (?src ?dst) {
                ( s:""" + node1 + """ s:""" + node2 + """ )
            }
            SERVICE <http://www.ontotext.com/path#search> {
                <urn:path> path:findPath path:shortestPath ;
                           path:sourceNode ?src ;
                           path:destinationNode ?dst ;
                           path:pathIndex ?path ;
                           path:startNode ?start;
                           path:endNode ?end;
                           path:maxPathLength 30 ;
                           path:resultBindingIndex ?index .
                SERVICE <urn:path> {
                    ?start :to ?end
              }
             }
        }""")
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()

    print('---------------------------')

    last = len(results["results"]["bindings"])
    if (last == 0): return '99'  # per qualch problema non gli va bene una stringa
    print(results["results"]["bindings"][last - 1]["index"]["value"])
    return results["results"]["bindings"][last - 1]["index"]["value"]


def get_distance_graphdb_path_bidirectional(node1, node2):
    sparql = SPARQLWrapper("http://localhost:7200/repositories/altair")
    sparql.setQuery("""PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        PREFIX : <http://www.disit.org/saref4bldg-ext/>
        PREFIX s: <https://saref.etsi.org/saref4bldg/>
        PREFIX c: <https://saref.etsi.org/core/>
        PREFIX path: <http://www.ontotext.com/path#>
        SELECT ?start ?end ?index ?path
        WHERE {
            VALUES (?src ?dst) {
                ( :""" + node1 + """ :""" + node2 + """ )
            }
            SERVICE <http://www.ontotext.com/path#search> {
                <urn:path> path:findPath path:shortestPath ;
                           path:sourceNode ?src ;
                           path:destinationNode ?dst ;
                           path:pathIndex ?path ;
                           path:startNode ?start;
                           path:endNode ?end;
                           path:resultBindingIndex ?index .
                SERVICE <urn:path> {
                ?start :to | ^:to ?end
                              }
             }
        }""")
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()

    print('---------------------------')
    print(node1 + ' ' + node2)
    last = len(results["results"]["bindings"])
    if (last == 0): return '9'
    print(results["results"]["bindings"][last - 1]["index"]["value"])
    print('---------------------------')
    return results["results"]["bindings"][last - 1]["index"]["value"]


def normalQuery():
    sparql = SPARQLWrapper('http://localhost:7200/repositories/altair')
    sparql.setQuery("""PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
                        PREFIX owl: <http://www.w3.org/2002/07/owl#>
                        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
                        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
                        PREFIX : <http://www.disit.org/saref4bldg-ext/>
                        PREFIX s: <https://saref.etsi.org/saref4bldg/>
                        PREFIX c: <https://saref.etsi.org/core/>
                        select *  {

                            ?s :to ?o.
                        }""")
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()
    list_of_object = []



    f = open(ROOT_DIR + '/file.txt', 'w')
    f.flush()


    for result in results["results"]["bindings"]:
        list_of_object.append({'subject':(result["s"]["value"]),'predicate':':to','object':(result["o"]["value"])})
        f.write('subject:'+result["s"]["value"]+' predicate:'':to'+' object:'+result["o"]["value"])
        f.write('\n')


    f.close()


    print(type(list_of_object))
    return list_of_object


if __name__ == '__main__':

    normalQuery()
