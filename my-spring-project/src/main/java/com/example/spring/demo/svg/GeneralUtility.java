package com.example.spring.demo.svg;

import javax.swing.*;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;

public class GeneralUtility {


  public static void dividiProprietaCongiunte(String csvName) throws Exception {


    long linesPrima = Files.lines(Paths.get("./all-csv-prorpieta-separate/" + csvName + ".csv")).count();


    

    File inputFile = null;
    File tempFile = null;
    try {
      inputFile = new File("./all-csv-prorpieta-separate/" + csvName + ".csv");
      tempFile = new File("./all-csv-prorpieta-separate/" + "prova" + ".csv");

      BufferedReader reader = new BufferedReader(new FileReader(inputFile));
      BufferedWriter writer = new BufferedWriter(new FileWriter(tempFile));
      String[] splitted = null;
      String[] splittedTo = null;
      String currentLine;

      while ((currentLine = reader.readLine()) != null) {

        if(currentLine.contains("ObjectProperty")) {
          splitted = currentLine.split(";");
          splittedTo = splitted[2].split("-");
          for(String s : splittedTo)
            System.out.println(s);
        }

      //  if (currentLine.equals(lineToRemove)) continue;
      //  writer.write(currentLine + System.getProperty("line.separator"));
      }
    //  writer.close();
    //  reader.close();
    //  boolean successful = tempFile.renameTo(inputFile);
    //  System.out.println(successful);

    } catch (Exception e) {
      e.printStackTrace();
    }


   // long linesDopo = Files.lines(Paths.get("./all_csv/" + csvName + ".csv")).count();


   // System.out.println("Righe prima" + linesPrima);
    // System.out.println("Righe dopo" + linesDopo);
   // System.setProperty("java.awt.headless", "false");

//    if (linesPrima != (linesDopo + 1)) {
//      JFrame frame = new JFrame("Erroree");
//      JOptionPane.showMessageDialog(frame, "Errore");
//      throw new Exception("Erroreeeee elimina");
//    }
//
//
//    boolean successful = tempFile.renameTo(inputFile);

  }


  public static void main(String[] args) throws Exception {


    GeneralUtility.dividiProprietaCongiunte("FERRICO_FERROSO_CLORO_FERRO.csv");
  }
}
