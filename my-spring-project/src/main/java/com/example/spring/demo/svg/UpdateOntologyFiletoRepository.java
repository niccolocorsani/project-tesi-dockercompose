package com.example.spring.demo.svg;

import org.eclipse.rdf4j.model.Resource;
import org.eclipse.rdf4j.model.impl.SimpleLiteral;
import org.eclipse.rdf4j.query.*;
import org.eclipse.rdf4j.repository.Repository;
import org.eclipse.rdf4j.repository.RepositoryConnection;
import org.eclipse.rdf4j.repository.http.HTTPRepository;
import org.eclipse.rdf4j.rio.RDFFormat;

import java.io.File;
import java.io.IOException;

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

    public static void runQuery(RepositoryConnection repositoryConnection, String query) {


        TupleQuery tupleQuery = repositoryConnection
                .prepareTupleQuery(QueryLanguage.SPARQL, query);
        TupleQueryResult result = null;

        try {
            result = tupleQuery.evaluate();
            while (result.hasNext()) {
                BindingSet bindingSet = result.next();

                SimpleLiteral name =
                        (SimpleLiteral) bindingSet.getValue("name");
                //  logger.trace("name = " + name.stringValue());
            }
        } catch (QueryEvaluationException qee) {
            // logger.error(WTF_MARKER,
            //        qee.getStackTrace().toString(), qee);
        } finally {
            result.close();
        }
    }

    public static void deleteEverythingFromRepository(RepositoryConnection repositoryConnection) {
        repositoryConnection.clear();
    }

    public static void uploadOntology(RepositoryConnection repCon,File ontology) throws IOException {
        repCon.add(ontology, String.valueOf(ontology.toURI()), RDFFormat.TURTLE, (Resource) null);
    }

    public static void main(String[] args) throws IOException {


    }


}
