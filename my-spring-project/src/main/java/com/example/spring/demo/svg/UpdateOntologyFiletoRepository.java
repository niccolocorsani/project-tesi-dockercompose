package com.example.spring.demo.svg;

import com.example.spring.demo.model.Triple;
import org.apache.jena.base.Sys;
import org.eclipse.rdf4j.model.Resource;
import org.eclipse.rdf4j.query.*;
import org.eclipse.rdf4j.repository.Repository;
import org.eclipse.rdf4j.repository.RepositoryConnection;
import org.eclipse.rdf4j.repository.http.HTTPRepository;
import org.eclipse.rdf4j.rio.RDFFormat;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class UpdateOntologyFiletoRepository {


  // GraphDB
  private static final String GRAPHDB_SERVER =
    "http://localhost:7200/";
  private static final String REPOSITORY_ID = "altair";


  public static RepositoryConnection getRepositoryConnection() {
    Repository repository = new HTTPRepository(
      GRAPHDB_SERVER, REPOSITORY_ID);
    repository.initialize();
    RepositoryConnection repositoryConnection =
      repository.getConnection();
    return repositoryConnection;
  }

  public static List<List<String>> runQuery(RepositoryConnection repositoryConnection, String query) {


    String prefixes = "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
      "                        PREFIX owl: <http://www.w3.org/2002/07/owl#>\n" +
      "                        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
      "                        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n" +
      "                        PREFIX : <http://www.disit.org/saref4bldg-ext/>\n" +
      "                        PREFIX s: <https://saref.etsi.org/saref4bldg/>\n" +
      "                        PREFIX c: <https://saref.etsi.org/core/>\n" +
      "                        PREFIX r: <http://www.disit.org/altair/resource/>";

    TupleQuery tupleQuery = repositoryConnection
      .prepareTupleQuery(QueryLanguage.SPARQL, prefixes + query);
    TupleQueryResult result = null;

    List<List<String>> returnedTableFromQuery = new ArrayList<>();
    List<String> returnedRow = new ArrayList<>();
    try {
      result = tupleQuery.evaluate();
      while (result.hasNext()) {
        returnedRow = new ArrayList<>();
        BindingSet bindingSet = result.next();
        for (String variable : result.getBindingNames()) {
          returnedRow.add(variable + ":" + bindingSet.getValue(variable));
        }
        returnedTableFromQuery.add(returnedRow);
      }
    } catch (QueryEvaluationException qee) {
      // logger.error(WTF_MARKER,
      //        qee.getStackTrace().toString(), qee);
    } finally {
      result.close();
      return returnedTableFromQuery;
    }
  }

  public static List<Triple> runQueryReturnListOfObject(RepositoryConnection repositoryConnection, String query) {


    String prefixes = "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
      "                        PREFIX owl: <http://www.w3.org/2002/07/owl#>\n" +
      "                        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
      "                        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n" +
      "                        PREFIX : <http://www.disit.org/saref4bldg-ext/>\n" +
      "                        PREFIX s: <https://saref.etsi.org/saref4bldg/>\n" +
      "                        PREFIX c: <https://saref.etsi.org/core/>\n" +
      "                        PREFIX r: <http://www.disit.org/altair/resource/>";

    TupleQuery tupleQuery = repositoryConnection
      .prepareTupleQuery(QueryLanguage.SPARQL, prefixes + query);
    System.out.println(query);
    TupleQueryResult result = null;

    List<Triple> listOfTriple = new ArrayList<>();

    try {
      result = tupleQuery.evaluate();
      while (result.hasNext()) {
        BindingSet bindingSet = result.next();
        Triple t = new Triple();
        for (String variable : result.getBindingNames()) {
          System.out.println(variable);

          if (variable.equals("s")) {
            t.setSubject(String.valueOf(bindingSet.getValue(variable)));
            System.out.println("Aggiunto " + String.valueOf(bindingSet.getValue(variable)));

          }
          if (variable.equals("p")) {
            t.setPredicate(String.valueOf(bindingSet.getValue(variable)));
            System.out.println("Aggiunto " + String.valueOf(bindingSet.getValue(variable)));

          }
          if (variable.equals("o")) {
            t.setObject(String.valueOf(bindingSet.getValue(variable)));
            System.out.println("Aggiunto " + String.valueOf(bindingSet.getValue(variable)));
          }

        }
        listOfTriple.add(t);
      }
    } catch (QueryEvaluationException qee) {
      // logger.error(WTF_MARKER,
      //        qee.getStackTrace().toString(), qee);
    } finally {
      result.close();
      return listOfTriple;
    }
  }


  public static void deleteEverythingFromRepository(RepositoryConnection repositoryConnection) {
    System.err.println("elimino repository");
    repositoryConnection.clear();
  }

  public static void uploadOntology(RepositoryConnection repCon, File ontology) throws IOException {
    repCon.add(ontology, String.valueOf(ontology.toURI()), RDFFormat.TURTLE, (Resource) null);
  }

  public static void main(String[] args) throws IOException {
    UpdateOntologyFiletoRepository.runQuery(UpdateOntologyFiletoRepository.getRepositoryConnection(), "select * {?s :to ?o}");


  }


}
