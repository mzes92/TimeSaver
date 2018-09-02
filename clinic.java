/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package service;

//import static com.sun.xml.ws.security.addressing.impl.policy.Constants.logger;
import com.google.gson.Gson;
import entity.Hospital;
import entity.HospitalGeneralList;
import entity.HospitalList;
import java.io.File;
import java.io.FileNotFoundException;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.*;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Scanner;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonValue;

import javax.ws.rs.core.Context;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.Consumes;
import javax.ws.rs.Produces;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PUT;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * REST Web Service
 *
 * @author Liza
 */
@Path("cilnic")
public class clinic {

    @Context
    private UriInfo context;

    /**
     * Creates a new instance of clinic
     */
    public clinic() {
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("test")
    public Response test(){
        return Response.ok()
                .entity("NO DATA")
                .header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT")
                .allow("OPTIONS").build();
    }
    
    
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("newPatientWaitingTime")
    public Response newPatientWaitingTime() throws SQLException{
        try {
          //Create AWS RDS database connection, DO NOT TOUCH
            Class.forName("com.mysql.jdbc.Driver");
            String dbName = "timesaverdb";
            String userName = "liza"; 
            String password = "12345678";
            String hostname = "timesaverdb.csywsvffkavh.ap-southeast-2.rds.amazonaws.com";
            String port = "3306";
            String jdbcUrl = "jdbc:mysql://" + hostname + ":" + port + "/" + dbName + "?user=" + userName + "&password=" + password + "&useSSL=false";
            Connection con = DriverManager.getConnection(jdbcUrl);

            Statement readStatement = con.createStatement();
            String query = "SELECT * FROM WaitinglistAUG w WHERE w.patientCategory='General'";
            ResultSet resultSet = readStatement.executeQuery(query);
            resultSet = readStatement.executeQuery(query);    
            ArrayList<HospitalGeneralList> hospitalArray = new ArrayList<>();
            while (resultSet.next()){
                    
                int d1 = resultSet.getInt("Waiting_D1");
                int d2 = resultSet.getInt("Waiting_D2");
                int d3 = resultSet.getInt("Waiting_D3");
                int d4 = resultSet.getInt("Waiting_D4");
                int d5 = resultSet.getInt("Waiting_D5");
                int d6 = resultSet.getInt("Waiting_D6");
                int totoalTreated = resultSet.getInt("totalTreated");
                totoalTreated = totoalTreated == 0 ? -1 : totoalTreated;
                int total = 0;
                int total1 = (d2 + d3+ d4 +d5 + d6)/totoalTreated;
                int total2 = (d3+ d4 +d5 + d6)/totoalTreated;
                int total3 = (d4 +d5 + d6)/totoalTreated;
                int total4 = (d5 + d6)/totoalTreated;
                int total5 = d6/ totoalTreated;
                int total6 = d6/totoalTreated;
                String hsName = resultSet.getString("clinicName");
                String category = resultSet.getString("patientCategory");
                HospitalGeneralList hs = new HospitalGeneralList(hsName, category, total1, total2, total3, total4, total5, total6);
                hospitalArray.add(hs);

            }

            con.close();
            return Response.ok()
                .entity(new Gson().toJson(hospitalArray))
                .header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT")
                .allow("OPTIONS").build();
//            return new Gson().toJson(hospitalArray);
            
        }                
        catch (SQLException ex) {
            Logger.getLogger(clinic.class.getName()).log(Level.SEVERE, null, ex);
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(clinic.class.getName()).log(Level.SEVERE, null, ex);
        }

        return Response.ok()
                .entity("NO DATA")
                .header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT")
                .allow("OPTIONS").build();
//        return "NO DATA";
    }
    
    
    
    /**
     * Retrieves representation of an instance of service.clinic
     * @return an instance of java.lang.String
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("getUserWaitingTime/{hospitalName}/{catagory}/{waitingPeriod}")
    public Response getUserWaitingTime(
            @PathParam("hospitalName") String hospitalName,
            @PathParam("catagory") String catagory,
            @PathParam("waitingPeriod") int waitingPeriod
            ) throws ClassNotFoundException, FileNotFoundException {
        //TODO return proper representation object
        
        try {
          //Create AWS RDS database connection, DO NOT TOUCH
            Class.forName("com.mysql.jdbc.Driver");
            String dbName = "timesaverdb";
            String userName = "liza"; 
            String password = "12345678";
            String hostname = "timesaverdb.csywsvffkavh.ap-southeast-2.rds.amazonaws.com";
            String port = "3306";
            String jdbcUrl = "jdbc:mysql://" + hostname + ":" + port + "/" + dbName + "?user=" + userName + "&password=" + password + "&useSSL=false";
            Connection con = DriverManager.getConnection(jdbcUrl);

            Statement readStatement = con.createStatement();
            String query = "SELECT * FROM WaitinglistAUG w WHERE w.clinicName='" + hospitalName 
                    + "' AND w.patientCategory='" + catagory + "';";
            ResultSet resultSet = readStatement.executeQuery(query);
            String columnName = "";
            switch (catagory){
                case "General Anaesthetic Category 1": 
                case "Priority 1": 
                case "Clinical Assessment": 
                    if (waitingPeriod < 1) {columnName = "D1";}
                    if (waitingPeriod >= 1 && waitingPeriod < 2) {columnName = "D2";}
                    if (waitingPeriod >= 2 && waitingPeriod < 3) {columnName = "D3";}
                    if (waitingPeriod >= 3 && waitingPeriod < 4) {columnName = "D4";}
                    if (waitingPeriod >= 4 && waitingPeriod < 5) {columnName = "D5";}
                    if (waitingPeriod >= 5) {columnName = "D6";}
                    break;
                case "General": 
                    if (waitingPeriod < 12) {columnName = "D1";}
                    if (waitingPeriod >= 12 && waitingPeriod < 24) {columnName = "D2";}
                    if (waitingPeriod >= 24 && waitingPeriod < 36) {columnName = "D3";}
                    if (waitingPeriod >= 36 && waitingPeriod < 48) {columnName = "D4";}
                    if (waitingPeriod >= 48 && waitingPeriod < 60) {columnName = "D5";}
                    if (waitingPeriod >= 60) {columnName = "D6";}
                    break;
                case "General Anaesthetic Category 2": 
                case "Priority 2":
                    if (waitingPeriod < 3) {columnName = "D1";}
                    if (waitingPeriod >= 4 && waitingPeriod < 6) {columnName = "D2";}
                    if (waitingPeriod >= 7 && waitingPeriod < 9) {columnName = "D3";}
                    if (waitingPeriod >= 10 && waitingPeriod < 12) {columnName = "D4";}
                    if (waitingPeriod >= 13 && waitingPeriod < 15) {columnName = "D5";}
                    if (waitingPeriod >= 15) {columnName = "D6";}
                    break;
                case "General Anaesthetic Category 3":     
                case "Priority 3": 
                    if (waitingPeriod < 6) {columnName = "D1";}
                    if (waitingPeriod >= 7 && waitingPeriod < 12) {columnName = "D2";}
                    if (waitingPeriod >= 13 && waitingPeriod < 18) {columnName = "D3";}
                    if (waitingPeriod >= 19 && waitingPeriod < 24) {columnName = "D4";}
                    if (waitingPeriod >= 25 && waitingPeriod < 30) {columnName = "D5";}
                    if (waitingPeriod >= 30) {columnName = "D6";}
                    break;   
            }
            
            if (resultSet.first()){
                int waitingTime = resultSet.getInt("Waiting_"+columnName);
                
                query = "SELECT * FROM WaitinglistAUG w WHERE w.clinicName!='" + hospitalName 
                    + "' AND w.patientCategory='" + catagory + "';";
                
                resultSet = readStatement.executeQuery(query);
                ArrayList<Hospital> hospitalArray = new ArrayList<>();
                HospitalList hsl = new HospitalList(hospitalName, catagory, waitingTime, new ArrayList<>(), 0);
                while (resultSet.next()){
                    
                    int d1 = resultSet.getInt("Waiting_D1");
                    int d2 = resultSet.getInt("Waiting_D2");
                    int d3 = resultSet.getInt("Waiting_D3");
                    int d4 = resultSet.getInt("Waiting_D4");
                    int d5 = resultSet.getInt("Waiting_D5");
                    int d6 = resultSet.getInt("Waiting_D6");
                    int totoalTreated = resultSet.getInt("totalTreated");
                    int total = 0;
                    switch (columnName){
                        case "D1": total = d2 + d3+ d4 +d5 + d6;  break;
                        case "D2": total = d3+ d4 +d5 + d6;  break;
                        case "D3": total = d4 +d5 + d6;  break;
                        case "D4": total = d5 + d6;  break;
                        case "D5": total = d6;  break;
                        case "D6": total = d6;  break;
                    }
                    
                    String hsName = resultSet.getString("clinicName");
                    String category = resultSet.getString("patientCategory");
                    Hospital hs = new Hospital(hsName, catagory, total, 0, total/(totoalTreated == 0? -1: totoalTreated)); //if totalTreated is 0, replayed by -1
                    hospitalArray.add(hs);
                }                
                hsl.setOtherHospitals(hospitalArray);
                con.close();
                return Response.ok()
                .entity(new Gson().toJson(hsl))
                .header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT")
                .allow("OPTIONS").build();
            }else{
                con.close();
                return response("ERROR, Data not found");
                
                
            }
            
        }                
        catch (SQLException ex) {
            Logger.getLogger(clinic.class.getName()).log(Level.SEVERE, null, ex);
        }
        return response("NO DATA");
    }

    public Response response(String body){
        return Response.ok()
            .entity(body)
            .header("Access-Control-Allow-Origin", "*")
            .header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT")
            .allow("OPTIONS").build();
    }
        
    /**
     * PUT method for updating or creating an instance of clinic
     * @param content representation for the resource
     */
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    public void putJson(String content) {
    }
}

