package com.example.spring.demo.svg;

import javax.swing.*;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;

public class GeneralUtility {


  public static void dividiProprietaCongiunte(String csvName) throws Exception {


    long linesPrima = Files.lines(Paths.get(System.getProperty("user.dir")+"/all-csv-prorpieta-separate-backup/" + csvName)).count();


    File inputFile = null;
    File tempFile = null;
    try {
      inputFile = new File(System.getProperty("user.dir")+"/all-csv-prorpieta-separate-backup/" + csvName);
      tempFile = new File(System.getProperty("user.dir")+"/all-csv-prorpieta-separate-generato/" + csvName);

      BufferedReader reader = new BufferedReader(new FileReader(inputFile));
      BufferedWriter writer = new BufferedWriter(new FileWriter(tempFile));
      String[] splitted = null;
      String[] splittedTo = null;
      String currentLine;

      int counterAddedProperty = 0;

      while ((currentLine = reader.readLine()) != null) {

        if (!currentLine.contains("ObjectProperty")) {
          writer.write(currentLine + System.getProperty("line.separator"));
          continue;
        }
        if (currentLine.contains("ObjectProperty")) {
          splitted = currentLine.split(";");
          if (!splitted[2].contains("-")) {
            writer.write(currentLine + System.getProperty("line.separator"));
            continue;
          }
          if (currentLine.contains("ObjectProperty")) {
            if (splitted[2].contains("-")) {
              splittedTo = splitted[2].split("-");
              System.out.println(splitted[2]);
              for (String s : splittedTo) {
                System.out.println(s);
                writer.write(splitted[0] + ";ObjectProperty;" + s + ";" + splitted[3] + System.getProperty("line.separator"));
                counterAddedProperty++;
              }
              counterAddedProperty--;
            }
          }
        }

      }
      writer.close();
      reader.close();

      long linesDopo = Files.lines(Paths.get(System.getProperty("user.dir")+"/all-csv-prorpieta-separate-generato/" + csvName)).count();


      System.out.println("Righe prima" + linesPrima);
      System.out.println("Righe dopo" + linesDopo);
      System.setProperty("java.awt.headless", "false");

      if (linesDopo < linesPrima) {
        JFrame frame = new JFrame("Erroree");
        JOptionPane.showMessageDialog(frame, "Errore");
        throw new Exception("Erroreeeee elimina");
      }

    } catch (Exception e) {
      e.printStackTrace();
    }


  }


  public static void main(String[] args) throws Exception {


    System.out.println(System.getProperty("user.dir"));

   /* File folder = new File("/Users/nicc/Desktop/Progetto-di-tesi-10-settembre-inzio/my-spring-project/all-csv-prorpieta-separate-backup/");
    File[] listOfFiles = folder.listFiles();
    for (int i = 0; i < listOfFiles.length; i++) {
      System.out.println(listOfFiles[i].getName());
      GeneralUtility.dividiProprietaCongiunte(listOfFiles[i].getName());
    }*/
  }
}
