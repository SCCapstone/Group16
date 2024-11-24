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
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RequestHandler {

    @Autowired
    private APIScraper scraper;

    /**
     * This method is to login or register a new user
     * @param username 
     * @param password 
     * @return the user's ID if login was successful, null if login failed
     */
    @CrossOrigin(origins = "http://localhost:4200")
    @GetMapping("/api/login")
    public Map<String, String> login(@RequestParam(value = "username", defaultValue = "NAME") String username, @RequestParam(value = "password", defaultValue = "PASSWORD") String password) {
        if(username == null || password == null) 
            return null;
        
        System.out.println("DEBUG: Request recieved - Username: \"" + username + "\" Password: \"" + password + "\"");

        Map<String, String> ret = new HashMap<>();

        String id = scraper.login(username, password);
        if(id.startsWith("Error")) {
            return null;
        }
        ret.put("id", id);
        return ret;
    }
    /**
     * This method is to complete assignments that are user made or not yet marked complete by blackboard
     * @param assID Assignment ID
     * @return if the assignment was successfully marked as complete
     */
    @GetMapping("/api/completeAssignment")
    public static boolean completeAssignment(@RequestParam(value = "assID", defaultValue = "NULL") String assID) {
        if(assID == null || assID.equals("NULL")) 
            return false;
        //pass the assignment ID to the database to mark the assignment as completed
        return false;
    }

    //TODO: Determine param types
    public static boolean addAssignment(String type, String task, String dueDate) {
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
    @GetMapping("/api/editPassword")
    public static boolean editPassword(@RequestParam(value = "oldPassword", defaultValue = "NULL") String oldPassword, @RequestParam(value = "newPassword", defaultValue = "NULL") String newPassword) {
        if(oldPassword == null || newPassword == null || oldPassword.equals("NULL") || newPassword.equals("NULL"))
            return false; // invalid password
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
    @GetMapping("/api/setPrimaryColor")
    public static boolean setPrimaryColor(@RequestParam(value = "colorHex", defaultValue = "NULL") String colorHex) {
        if(colorHex == null || colorHex.equals("NULL")) 
            return false; // invalid input
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
