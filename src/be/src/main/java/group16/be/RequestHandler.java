/*
 * RequestHandler.java
 * This class is used to handle requests from the user interface
 * 
 * Author: Team 16
 * Date: November 2024
 * Team member(s): Cam Osterholt
 */

package group16.be;

import java.awt.Color;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RequestHandler {
    private static RequestHandler requestHandler;

    public static RequestHandler getInstance() {
        if (requestHandler == null) {
            requestHandler = new RequestHandler();
        }
        return requestHandler;
    }

    private RequestHandler() {
        //TODO: Initialize database connection
    }

    /**
     * This method is to login or register a new user
     * TEST: http://localhost:1616/api/login?username=Cam&password=urmom
     * @param username 
     * @param password 
     * @return the user's ID if login was successful, null if login failed
     */
    @CrossOrigin(origins = "http://localhost:4200")
    @GetMapping("/api/login")
    public static String login(@RequestParam(value = "username", defaultValue = "NAME") String username, @RequestParam(value = "password", defaultValue = "PASSWORD") String password) {
        if(username == null || password == null) 
            return null;
        //pass the username and password to the database to check if the user exists
        
        // if not, ask if user wants to register
        return "DEBUG: Name = " + username + ", Password = " + password;
    }

    /**
     * This method is to complete assignments that are user made or not yet marked complete by blackboard
     * @param assID Assignment ID
     * @return if the assignment was successfully marked as complete
     */
    public static boolean completeAssignment(String assID) {
        if(assID == null) 
            return false;
        //pass the assignment ID to the database to mark the assignment as completed
        
        return false;
    }

    //TODO: Determine param types
    public static boolean addAssignment(String type, String task, String dueDate) {
        if(type == null || task == null) 
            return false; // invalid type or task
        
        //pass the assignment details to the database to add the assignment
        return false;
    }

    //TODO: complete function
    // public static boolean editAssignment() {
    //     //pass the assignment details to the database to edit the assignment
    // }

    /**
     * This method is to edit the password of the user
     * @param oldPassword
     * @param newPassword
     * @return
     */
    public static boolean editPassword(String oldPassword, String newPassword) {
        //pass the old and new password to the database to update the user's password
        return false;
    }

    // ---------Settings Methods---------
    public static boolean editName(String name) {
        //pass the new name to the database to update the user's name
        return false;
    }

    public static boolean editEmail(String email) {
        //pass the new email to the database to update the user's email
        return false;
    }

    public static boolean editPhoneNum(String phoneNum) {
        //pass the new phone number to the database to update the user's phone number
        return false;
    }

    /**
     * This method is to change the user's primary color
     * @param colorHex the new color in HEX format
     * @return if the color was successfully changed
     */
    public static boolean setPrimaryColor(String colorHex) {
        try {
            Color color = Color.decode(colorHex);
            // pass the new color to the database to update the user's primary color
            return true;
        } catch (NumberFormatException e) {
            // handle invalid hex code
            return false;
        }
    }

    /**
     * This method is to change the user's accent color
     * @param colorHex the new color in HEX format
     * @return if the color was successfully changed
     */
    public static boolean setAccentColor(String colorHex) {
        try {
            Color color = Color.decode(colorHex);
            // pass the new color to the database to update the user's accent color
            return true;
        } catch (NumberFormatException e) {
            // handle invalid hex code
            return false;
        }
    }

    /**
     * This method is to change the user's notification setting
     * @return if the notification setting was successfully changed
     */
    public static boolean toggleNotifications() {
        //pass the new notification setting to the database to update the user's notification setting
        return false;
    }
}
