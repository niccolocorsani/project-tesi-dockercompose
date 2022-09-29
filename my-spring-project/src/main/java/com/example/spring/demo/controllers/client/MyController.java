package com.example.spring.demo.controllers.client;

import com.example.spring.demo.svg.Main;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;


import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.*;

@CrossOrigin
@RestController
@RequestMapping("/svg")
public class MyController {



  @GetMapping("/get")
  //http://localhost:8080/spring-app/svg/get?values=abc,2,3
  public String getSVG(@RequestParam List<String> values, @RequestParam List<String> schermate) throws IOException {

    Main main = new Main();
    List<String> variablesToColor = values;
    main.execute(variablesToColor, schermate);
    System.out.println("SVG.....");
    String svg = Files.readString(Path.of("./generated_svg/" + this.getLastSvgGenerated()));

    return svg;

  }


  @RequestMapping(value = "/svg-download", method = RequestMethod.GET)
  @ResponseBody
  public ResponseEntity<byte[]> downloadSVG() throws IOException {

    String content = Files.readString(Path.of("./generated_svg/" + this.getLastSvgGenerated()));
    HttpHeaders httpHeaders = new HttpHeaders();
    httpHeaders.set(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_OCTET_STREAM_VALUE); // (3) Content-Type: application/octet-stream
    httpHeaders.set(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment().filename("union.svg").build().toString()); // (4) Content-Disposition: attachment; filename="demo-file.txt"
    return ResponseEntity.ok().headers(httpHeaders).body(content.getBytes()); // (5) Return Response
  }

  @RequestMapping(value = "/files", method = RequestMethod.GET)
  @ResponseBody
  public ResponseEntity<byte[]> getFile() throws IOException {

    String content = Files.readString(Path.of("./ontologies/con_individuals.owl"));
    HttpHeaders httpHeaders = new HttpHeaders();
    httpHeaders.set(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_OCTET_STREAM_VALUE); // (3) Content-Type: application/octet-stream
    httpHeaders.set(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment().filename("ontology.owl").build().toString()); // (4) Content-Disposition: attachment; filename="demo-file.txt"
    return ResponseEntity.ok().headers(httpHeaders).body(content.getBytes()); // (5) Return Response
  }


  @GetMapping("/update-csv")
  //http://localhost:8080/spring-app/svg/get?values=abc,2,3
  public String
  updateCSV(@RequestParam String infoToAddToCSV, @RequestParam String csvName) throws IOException {


    try {
      Files.write(Paths.get("./all_csv/"+csvName+".csv"), (infoToAddToCSV+"\n").getBytes(), StandardOpenOption.APPEND);
    } catch (IOException e) {
      System.err.println("probelma nella scrittura");
      System.err.println(e.getMessage());
      e.printStackTrace();

    }

    return null;

  }


  public String getLastSvgGenerated() {
    File folder = new File("./generated_svg/");
    File[] listOfFiles = folder.listFiles();
    Map<String, Long> fileName_DateMap = new TreeMap();
    for (File f : listOfFiles) {
      fileName_DateMap.put(f.getName(), f.lastModified());
    }
    String key = Collections.max(fileName_DateMap.entrySet(), Map.Entry.comparingByValue()).getKey();
    return key;
  }


  @ExceptionHandler(value = Exception.class)
  public ResponseEntity<String> handleNullPointerException(Exception e) {
    String error = "";
    error = e.getMessage();
    System.err.println(e.getMessage());
    HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
    return new ResponseEntity<>(error, status);
  }

}
