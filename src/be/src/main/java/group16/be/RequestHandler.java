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
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import group16.be.db.Assignment;
import group16.be.db.Course;
import group16.be.db.User;

@RestController
public class RequestHandler {

    @Autowired
    private APIScraper scraper;

    private static Connection connection;

    public RequestHandler() {
        connection = new Connection(Environment.MONGO_URL);
    }

    /**
     * This method is to login or register a new user
     * @param username 
     * @param password 
     * @return the user's ID if login was successful, null if login failed
     */
    @CrossOrigin //(origins = "http://localhost:4200")
    @GetMapping("/api/login")
    public Map<String, String> login(@RequestParam(value = "username", defaultValue = "NAME") String username, @RequestParam(value = "password", defaultValue = "NULL") String password) {
        if(username == null || username.equals("NAME"))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username is missing or invalid");
        if(password == null || password.equals("NULL"))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password is missing or invalid");
        return loginLogic(username, password);
    }

    public Map<String, String> loginLogic(String username, String password) {
        if(username == null)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username is missing or invalid");
        else if (password == null) 
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password is missing or invalid");
        Map<String, String> ret = new HashMap<>();

        String id = scraper.login(username, password); 
        if(id.startsWith("Error")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, id);
        }
        ret.put("id", id);
        return ret;
    }

    /**
     * This method is to get the user's courses
     * @param id the user's ID
     * @return the user's list of courses
     */
    @CrossOrigin //(origins = "http://localhost:4200")
    @GetMapping("/api/getCourses")
    public List<Course> getCourses(@RequestParam(value = "userId", defaultValue = "NULL") String userId) {
        if(userId == null || userId.equals("NULL"))  
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User ID is missing or invalid");
        //pass the user's ID to the database to get the user's courses
        return scraper.getCourses(userId);
    }

    /**
     * This method is to complete assignments that are user made or not yet marked complete by blackboard
     * @param assID Assignment ID
     * @return if the assignment was successfully marked as complete
     */
    @PutMapping("/api/completeAssignment")
    public static boolean completeAssignment(@RequestParam(value = "assID", defaultValue = "NULL") String assID) {
        if(assID == null || assID.equals("NULL")) 
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User ID is missing or invalid");
        //pass the assignment ID to the database to mark the assignment as completed
        // return false;
        throw new ResponseStatusException(HttpStatus.NOT_IMPLEMENTED, "Function not implemented");
    }

    /**
     * This method is to create assignments without a specified id
     * @param title title of assignment
     * @param description short description for assignment
     * @param dueDate due date time for assignment
     * @param userId user's ID
     * @param courseId course ID
     * @return if the assignment was successfully created
     */
    @CrossOrigin
    @PostMapping("/api/createAssignmentWithoutId")
    public static boolean addAssignmentWithoutId(@RequestParam(value = "title", defaultValue = "NULL") String title,
     @RequestParam(value = "description", defaultValue = "NULL") String description, @RequestParam(value = "dueDate", defaultValue = "NULL") String dueDate,
     @RequestParam(value = "userId", defaultValue = "NULL") String userId, @RequestParam(value = "courseId", defaultValue = "NULL") String courseId) {
        if(title == null || title.equals("NULL") || dueDate == null || dueDate.equals("NULL") || userId == null || userId.equals("NULL") || courseId == null || courseId.equals("NULL")) {
            return false;
        }
        Assignment assignment = new Assignment()
                .randomUUID()
                .setTitle(title)
                .setDescription(description)
                .setDueDate(dueDate)
                .setUserId(userId)
                .setCourseId(courseId);
        ObjectMapper objectMapper = new ObjectMapper();
        
        try {
            connection.insertNewData("assignments", objectMapper.writeValueAsString(assignment));
            return true;
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return false;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Get all assignments from the database
     * @param userId the user's ID
     * @return a list of all assignments
     */
    @CrossOrigin
    @GetMapping("/api/getAssignments")
    public List<Assignment> getAssignments(@RequestParam(value = "userId", defaultValue = "NULL") String userId) {
        //pass the user's ID to the database to get the user's assignments
        if(userId == null || userId.equals("NULL")) 
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User ID is missing or invalid");
        List<Assignment> assignments = scraper.getAssignments(userId);
        if(assignments == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No assignments found for user");
        }
        return assignments;
    }

    //TODO: complete function
    // public static boolean editAssignment() {
    //     //pass the assignment details to the database to edit the assignment
    // }

    
    /**
     * Edits the user's password by updating it in the database.
     *
     * @param oldPassword the user's current password
     * @param newPassword the user's new password
     * @return true if the password was successfully updated, false otherwise
     * @throws ResponseStatusException if the old or new password is missing or invalid, or if the function is not implemented
     * @Unimplemented This method is not yet implemented.
     */
    @CrossOrigin
    @PutMapping("/api/editPassword")
    public static boolean editPassword(@RequestParam(value = "oldPassword", defaultValue = "NULL") String oldPassword, @RequestParam(value = "newPassword", defaultValue = "NULL") String newPassword) {
        // if(oldPassword == null || oldPassword.equals("NULL"))
        //     throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Old password is missing or invalid");
        // else if (newPassword == null || newPassword.equals("NULL"))
        //     throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "New password is missing or invalid");
        //pass the old and new password to the database to update the user's password
        throw new ResponseStatusException(HttpStatus.NOT_IMPLEMENTED, "Function not implemented");
        // return false;
    }

    /**
     * This method is to change the user's primary color
     * @param colorHex the new color in HEX format
     * @return if the color was successfully changed
     */
    @CrossOrigin
    @PutMapping("/api/setPrimaryColor")
    public static boolean setPrimaryColor(@RequestParam(value = "colorHex", defaultValue = "NULL") String colorHex) {
        if(colorHex == null || colorHex.equals("NULL")) 
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Color is missing or invalid");
        try {
            Color color = Color.decode(colorHex);
            // pass the new color to the database to update the user's primary color
            // return true;
            throw new ResponseStatusException(HttpStatus.NOT_IMPLEMENTED, "Function not implemented");
        } catch (NumberFormatException e) {
            // handle invalid hex code
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid color format");
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
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid color format");
        }
    }

    /**
     * This method is to change the user's notification setting
     * @return if the notification setting was successfully changed
     */
    public static boolean toggleNotifications() {
        //pass the new notification setting to the database to update the user's notification setting
        throw new ResponseStatusException(HttpStatus.NOT_IMPLEMENTED, "Function not implemented");
    }

    /**
     * This method returns a json file representing the user's data.
     * @param userId
     * @return the user object
     * @throws ResponseStatusException if the user ID is missing or invalid, if the user is not found, or if there are multiple users with the same ID
     */
    @CrossOrigin
    @GetMapping("/api/getUser")
    public User getUser(@RequestParam(value = "userId", defaultValue = "NULL") String userId) {
        if(userId == null || userId.equals("NULL")) 
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User ID is missing or invalid");
        List<User> users = scraper.getUser(userId);
        if(users.size() == 0)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        if(users.size() > 1)
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Multiple users with the same ID");
        return users.get(0);
    }

    /**
     * This method is to toggle the user's email notifications, the user ID is the only parameter as it toggles the saved value from mongo
     * @param userId the user's ID
     * @return True if the email notifications were successfully toggled
     * @throws ResponseStatusException if the user ID is missing or invalid, if the user is not found, or if there are multiple users with the same ID
     */
    @CrossOrigin
    @PostMapping("/api/toggleEmailNotifications")
    public boolean toggleEmailNotifications(@RequestParam(value = "userId", defaultValue = "NULL") String userId) {
        User user = getUser(userId);
        user.toggleEmailNotifications();
        return scraper.saveUser(user);
    }

    /**
     * This method is to toggle the user's institution email notifications, the user ID is the only parameter as it toggles the saved value from mongo
     * @param userId the user's ID
     * @return True if the institution email notifications were successfully toggled
     * @throws ResponseStatusException if the user ID is missing or invalid, if the user is not found, or if there are multiple users with the same ID
     */
    @CrossOrigin
    @PostMapping("/api/toggleInstitutionEmailNotifications")
    public boolean toggleInstitutionEmailNotifications(@RequestParam(value = "userId", defaultValue = "NULL") String userId) {
        User user = getUser(userId);
        user.toggleInstitutionEmailNotifications();
        return scraper.saveUser(user);
    }

    /**
     * This method is to toggle the user's SMS notifications, the user ID is the only parameter as it toggles the saved value from mongo
     * @param userId the user's ID
     * @return True if the SMS notifications were successfully toggled
     * @throws ResponseStatusException if the user ID is missing or invalid, if the user is not found, or if there are multiple users with the same ID
     */
    @CrossOrigin
    @PostMapping("/api/toggleSmsNotifications")
    public boolean toggleSmsNotifications(@RequestParam(value = "userId", defaultValue = "NULL") String userId) {
        User user = getUser(userId);
        user.toggleSmsNotifications();
        return scraper.saveUser(user);
    }

    /**
     * This method updates a user's preferred name
     * @param userId the user's ID
     * @param preferredName the user's new name
     * @return True if the preferred name was successfully updated
     * @throws ResponseStatusException if the user ID is missing or invalid, if the user is not found, or if there are multiple users with the same ID
     */
    @CrossOrigin
    @PostMapping("/api/updatePreferredName")
    public boolean updatePreferredName(@RequestParam(value = "userId", defaultValue = "NULL") String userId, @RequestParam(value = "preferredName", defaultValue = "NULL") String preferredName) {
        if(preferredName == null || preferredName.equals("NULL")) 
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Preferred name is missing or invalid");
        User user = getUser(userId);
        user.setPreferredName(preferredName);
        return scraper.saveUser(user);
    }

    /**
     * This method updates a user's email
     * @param userId the user's ID
     * @param email the user's new email
     * @return True if the email was successfully updated
     * @throws ResponseStatusException if the user ID is missing or invalid, if the user is not found, or if there are multiple users with the same ID
     */
    @CrossOrigin
    @PostMapping("/api/updateEmail")
    public boolean updateEmail(@RequestParam(value = "userId", defaultValue = "NULL") String userId, @RequestParam(value = "email", defaultValue = "NULL") String email) {
        if(email == null || email.equals("NULL")) 
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is missing or invalid");
        if(!User.testEmailRegex(email))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is invalid");
        User user = getUser(userId);
        user.setEmail(email);
        return scraper.saveUser(user);
    }

    /**
     * This method updates a user's phone number
     * @param userId the user's ID
     * @param phoneNumber the user's new phone number
     * @return True if the phone number was successfully updated
     */
    @CrossOrigin
    @PostMapping("/api/updatePhoneNumber")
    public boolean updatePhoneNumber(@RequestParam(value = "userId", defaultValue = "NULL") String userId, @RequestParam(value = "phoneNumber", defaultValue = "NULL") String phoneNumber) {
        if(phoneNumber == null || phoneNumber.equals("NULL")) 
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Phone number is missing or invalid");
        User user = getUser(userId);
        user.setMobilePhone(phoneNumber);
        return scraper.saveUser(user);
    }
}

