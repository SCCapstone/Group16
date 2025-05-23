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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import group16.be.db.Assignment;
import group16.be.db.Grade;
import group16.be.db.User;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Cookie;

@RestController
public class RequestHandler {

    @Autowired
    private APIScraper scraper;

    private static HeartbeatController heartbeatController;

    @Autowired
    public void setHeartbeatController(HeartbeatController heartbeatController) {
        RequestHandler.heartbeatController = heartbeatController;
    }

    @Autowired
    private NotificationManager notificationManager;

    @Autowired
    private TokenService tokenService;

    /**
     * This method is to login or register a new user.
     * See {@link group16.be.RequestHandlerTests#testLogin()} for related tests.
     * @param username 
     * @param password 
     * @return the user's ID if login was successful
     */
    @CrossOrigin
    @PostMapping("/api/login")
    public ResponseEntity<?> login(@RequestParam(value = "username", defaultValue = "NAME") String username, 
                                   @RequestParam(value = "password", defaultValue = "NULL") String password,
                                   HttpServletResponse response,
                                   @CookieValue(value = "auth-token", required = false) String authToken) {
        // Check if the user has a valid auth token
        if(authToken != null && tokenService.validateToken(authToken)) {
            String userId = tokenService.getAuthentication(authToken).getName();
            if(userId != null && validateUserId(userId).getStatusCode() == HttpStatus.OK) {
                HashMap<String, String> ret = new HashMap<>();
                ret.put("id", userId);
                return ResponseEntity.ok(ret);
            }
        }

        if(username == null || username.equals("NAME"))
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username is missing or invalid");
        if(password == null || password.equals("NULL"))
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Password is missing or invalid");
        
        String userId = scraper.login(username, password); 
        if(userId.startsWith("Error: Multiple")) 
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(userId);
        else if (userId.equals("Error: Invalid Credentials"))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(userId);

        // Generate JWT
        String token = tokenService.generateToken(userId);

        // Create cookie
        Cookie cookie = new Cookie("auth-token", token);
        cookie.setHttpOnly(true);   
        cookie.setPath("/"); // Set the path for the cookie
        cookie.setMaxAge(7 * 60 * 60 * 24); // Set the cookie to expire in 7 day
        
        response.addCookie(cookie); // Add the cookie to the response

        HashMap<String, String> ret = new HashMap<>();
        ret.put("id", userId);

        return ResponseEntity.ok(ret);
    }

    /**
     * This method is in reponse to a heartbeat from the user
     * @param id the user's ID
     * @return
     */
    @CrossOrigin
    @PostMapping("/api/heartbeat")
    public static boolean hitUser(@RequestParam(value = "id", defaultValue = "NULL") String id) {
        if (id == null || id.equals("NULL")) {
            return false;
        }
        heartbeatController.loggedInUsers.put(id, true);
        return true;
    }

    /**
     * This method is to get the user's courses.
     * See {@link group16.be.RequestHandlerTests#testGetCourses()} for related tests.
     * @param id the user's ID
     * @return the user's ArrayList of courses
     * @throws ResponseStatusException if the user ID is missing or invalid
     * @throws ResponseStatusException if no courses are found for the user
     */
    @CrossOrigin //(origins = "http://localhost:4200")
    @GetMapping("/api/getCourses")
    public ResponseEntity<?> getCourses(@RequestParam(value = "userId", defaultValue = "NULL") String userId) {
        if(userId == null || userId.equals("NULL"))
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User ID is missing or invalid");
        if(validateUserId(userId).getStatusCode() != HttpStatus.OK)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No user with that Id exists");
        
        var courses = scraper.getCourses(userId);
        if(courses == null || courses.size() == 0)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No courses found for user");
        return ResponseEntity.ok(courses);
    }

    /**
     * Gets course by Course Id
     * See {@link group16.be.RequestHandlerTests#testFindCourseById()} for related tests.
     * @param courseId
     * @return
     */
    @CrossOrigin
    @GetMapping("/api/getCourseById")
    public ResponseEntity<?> getCourseById(@RequestParam(value = "courseId", defaultValue = "NULL") String courseId) {
        if(courseId == null || courseId.equals("NULL")) 
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Course ID is missing or invalid");
        if(validateCourseId(courseId).getStatusCode() != HttpStatus.OK)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No course with that Id exists");
        
        var course = scraper.findByCourseId(courseId);
        if(course == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No course with this Id exists");
        return ResponseEntity.ok(course);
    }

    /**
     * This method returns a json file representing the user's data.
     * See {@link group16.be.RequestHandlerTests#testGetUser()} for related tests.
     * @param userId
     * @return the user object
     * @throws ResponseStatusException if the user ID is missing or invalid, if the user is not found, or if there are multiple users with the same ID
     */
    @CrossOrigin
    @GetMapping("/api/getUser")
    public ResponseEntity<?> getUser(@RequestParam(value = "userId", defaultValue = "NULL") String userId) {
        if(userId == null || userId.equals("NULL")) 
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User ID is missing or invalid");
        if(validateUserId(userId).getStatusCode() != HttpStatus.OK)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No user with that Id exists");
        
        var user = scraper.getUser(userId);
        if(user == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        return ResponseEntity.ok(user);
    }

    /**
     * Get all assignments from the database
     * See {@link group16.be.RequestHandlerTests#testGetAssignments()} for related tests.
     * @param userId the user's ID
     * @return a ArrayList of all assignments
     */
    @CrossOrigin
    @GetMapping("/api/getAssignments")
    public ResponseEntity<?> getAssignments(@RequestParam(value = "userId", defaultValue = "NULL") String userId) {
        //pass the user's ID to the database to get the user's assignments
        if(userId == null || userId.equals("NULL")) 
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User ID is missing or invalid");
        if(validateUserId(userId).getStatusCode() != HttpStatus.OK)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No user with that Id exists");
        
        var assignments = scraper.getAssignments(userId);
        if(assignments == null || assignments.size() == 0) 
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No assignments found for user");
        return ResponseEntity.ok(assignments);
    }

    /**
     * Get assignment by ID
     * See {@link group16.be.RequestHandlerTests#testFindAssignmentById()} for related tests.
     * @param assignmentId the assignment's ID
     * @return the assignment
     */
    public ResponseEntity<?> getAssignmentById(@RequestParam(value = "assignmentId", defaultValue = "NULL") String assignmentId) {
        if(assignmentId == null || assignmentId.equals("NULL")) 
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Assignment ID is missing or invalid");
        if(validateAssignmentId(assignmentId).getStatusCode() != HttpStatus.OK)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No assignment with that Id exists");
    
        var assignment = scraper.findByAssignmentId(assignmentId);
        if(assignment == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Assignment not found");
        return ResponseEntity.ok(assignment);
    }

    /**
     * This method is to complete assignments that are user made or not yet marked complete by blackboard
     * See {@link group16.be.RequestHandlerTests#testCompleteAssignment()} for related tests.
     * @param assID Assignment ID
     * @return if the assignment was successfully marked as complete
     * @Unimplemented This method is not yet implemented.
     */
    @CrossOrigin
    @PutMapping("/api/completeAssignment")
    public ResponseEntity<?> completeAssignment(@RequestParam(value = "assID", defaultValue = "NULL") String assID) {
        if(assID == null || assID.equals("NULL")) 
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User ID is missing or invalid");
        
        //pass the assignment ID to the database to mark the assignment as completed
        return setAssignmentComplete(assID, true);
    }

    /**
     * This method is to uncomplete assignments that are user made or not yet marked complete by blackboard
     * @param assID
     * @param isComplete
     * @return
     */
    @CrossOrigin
    @PutMapping("/api/openAssignment")
    public ResponseEntity<?> openAssignment(@RequestParam(value = "assID", defaultValue = "NULL") String assID) {
        if(assID == null || assID.equals("NULL")) 
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User ID is missing or invalid");
        
        //pass the assignment ID to the database to mark the assignment as incomplete
        return setAssignmentComplete(assID, false);
    }

    /**
     * This method is to create assignments without a specified id
     * See {@link group16.be.ModifyDatabaseTests#testAddAssignment()} for related tests.
     * @param title title of assignment
     * @param description short description for assignment
     * @param dueDate due date time for assignment
     * @param userId user's ID
     * @param courseId course ID
     * @return if the assignment was successfully created
     */
    @CrossOrigin
    @PostMapping("/api/createAssignmentWithoutId")
    public ResponseEntity<?> addAssignmentWithoutId(@RequestParam(value = "title", defaultValue = "NULL") String title,
                                                    @RequestParam(value = "description", defaultValue = "NULL") String description, 
                                                    @RequestParam(value = "dueDate", defaultValue = "NULL") String dueDate,
                                                    @RequestParam(value = "userId", defaultValue = "NULL") String userId, 
                                                    @RequestParam(value = "courseId", defaultValue = "NULL") String courseId) {
        var response = validateAssignmentParams(title, description, dueDate, userId, courseId);
        if(!response.getStatusCode().equals(HttpStatus.OK))
            return response;

        if(description == null || description.equals("NULL")) description = "";
        
        if(!scraper.isUserId(userId) || !scraper.isCourseId(courseId))
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Course ID or assignment ID is invalid");

        // Search for existing Assignment.
        var assignments = scraper.getAssignments(userId);
        for (var assignment : assignments) {
            // Assignment already exists. Returning HTTP error.
            if (assignment.getCourseId().equals(courseId) && assignment.getTitle().equalsIgnoreCase(title))
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Assignment already exists");
        }

        var assignment = new Assignment(userId, courseId, title, description, dueDate, true);
        var grade = new Grade(userId, courseId, assignment.getId(), -1.0);
        if(scraper.saveAssignment(assignment) && scraper.saveGrade(grade))
            return ResponseEntity.ok(assignment);
        else
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving assignment");
    }

    /**
     * Edit Assignment's Details
     * See {@link group16.be.ModifyDatabaseTests#testEditAssignment()} for related tests.
     * @param userId
     * @return
     */
    @CrossOrigin
    @PutMapping("/api/editAssignment")
    public ResponseEntity<?> editAssignment(@RequestParam(value = "userId", defaultValue = "NULL") String userId, 
                                            @RequestParam(value = "courseId", defaultValue = "NULL") String courseId, 
                                            @RequestParam(value = "assignmentId", defaultValue = "NULL") String assignmentId, 
                                            @RequestParam(value = "title", defaultValue = "NULL") String title, 
                                            @RequestParam(value = "description", defaultValue = "NULL") String description, 
                                            @RequestParam(value = "dueDate", defaultValue = "NULL") String dueDate) {
        var response = validateAssignmentParams(title, description, dueDate, userId, courseId);
        if(!response.getStatusCode().equals(HttpStatus.OK))
            return response;

        if(assignmentId == null || assignmentId.equals("NULL")) 
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Assignment ID is missing or invalid");

        if(!scraper.isUserId(userId) || !scraper.isCourseId(courseId) || !scraper.isAssignmentId(assignmentId))
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Course ID, assignment ID, or user ID is invalid");

        // Search for existing Assignment.
        var assignments = scraper.getAssignments(userId);
        for (var assignment : assignments) {
            // Assignment already exists. Returning HTTP error.
            if (assignment.getCourseId().equals(courseId) && assignment.getTitle().equalsIgnoreCase(title))
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Assignment already exists");
        }

        var assignment = scraper.findByAssignmentId(assignmentId);
        if(assignment == null) 
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Assignment not found");
        if(!assignment.getUserId().equals(userId))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User does not have permission to view this assignment");
        if(!assignment.isUserCreated())
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User does not have permission to edit this assignment");

        // Modify the assignment
        assignment.editAssignment(title, description, dueDate, courseId);
        if(scraper.saveAssignment(assignment))
            return ResponseEntity.ok(assignment);
        else
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving assignment");
    }

    /**
     * Remove an assignment from the database
     * @param assignmentId
     * @return
     */
    @CrossOrigin
    @DeleteMapping("/api/removeAssignment") 
    public ResponseEntity<?> removeAssignment(@RequestParam(value = "assignmentId", defaultValue = "NULL") String assignmentId) {
        if(assignmentId == null || assignmentId.equals("NULL")) 
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Assignment ID is missing or invalid");
        
        var assignment = scraper.findByAssignmentId(assignmentId);
        var grade = scraper.getGradeByAssignmentId(assignmentId);
        
        if(assignment == null) 
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Assignment not found");
        else if(!assignment.isUserCreated()) 
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User does not have permission to delete this assignment");
        
        if(scraper.deleteAssignment(assignment) && scraper.deleteGrade(grade))
            return ResponseEntity.ok().build();
        else
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting assignment");
    }

    /**
     * Get all grades for current user
     * See {@link group16.be.RequestHandlerTests#testGetGrades()} for related tests.
     * @param userId the user's ID
     * @return 
     */
    @CrossOrigin
    @GetMapping("/api/getGrades")
    public ResponseEntity<?> getGrades(@RequestParam(value = "userId", defaultValue = "NULL") String userId) {
        if(userId == null || userId.equals("NULL")) 
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User ID is missing or invalid");
        if(validateUserId(userId).getStatusCode() != HttpStatus.OK)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No user with that Id exists");
        
        // pass the user's ID to the database to get the user's grades
        var grades = scraper.getGrades(userId);
        if(grades == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No grades found for user");
        return ResponseEntity.ok(grades);
    }

    /**
     * Set grade for a user
     * See {@link group16.be.ModifyDatabaseTests#testSetGrade()} for related tests.
     * @param userId the user's ID
     * @param courseId the course's ID
     * @param assignmentId the assignment's ID
     * @param percent the grade percentage
     * @return True if the grade was successfully set
     * @throws ResponseStatusException if the user ID, course ID, or assignment ID is missing or invalid
     */
    @CrossOrigin
    @PostMapping("/api/setGrade")
    public ResponseEntity<?> setGrade(@RequestParam(value = "gradeId", defaultValue = "NULL") String gradeId,  
                                      @RequestParam(value = "percent", defaultValue = "NULL") double percent) {
        if(gradeId == null || gradeId.equals("NULL"))
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Grade ID is missing or invalid");
        if(percent < 0) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Percent is invalid");
        
        var grade = scraper.getGradeByGradeId(gradeId);
        if(grade == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Grade not found");
        
        var assignment = scraper.findByAssignmentId(grade.getAssignmentId());
        if(!assignment.isUserCreated()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User does not have permission to edit this grade");
        
        grade.setPercent(percent);
        if(scraper.saveGrade(grade))
            return ResponseEntity.ok(grade);
        else
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving grade");
    }

    /**
     * Edits the user's password by updating it in the database.
     * See {@link group16.be.ModifyDatabaseTests#testEditPassword()} for related tests.
     * @param oldPassword the user's current password
     * @param newPassword the user's new password
     * @Unimplemented This method is not yet implemented.
     */
    @CrossOrigin
    @PutMapping("/api/editPassword")
    public ResponseEntity<?> editPassword(@RequestParam(value = "userId", defaultValue = "NULL") String userId, @RequestParam(value = "oldPassword", defaultValue = "NULL") String oldPassword, @RequestParam(value = "newPassword", defaultValue = "NULL") String newPassword) {
        var user = scraper.getUser(userId);
        if(user == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        if(!user.checkPassword(oldPassword)) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid password");
        user.setPassword(newPassword);
        if(scraper.saveUser(user))
            return ResponseEntity.ok(user);
        else
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving user");
    }

    /**
     * This method is to change the user's primary color
     * @param colorHex the new color in HEX format
     * @return if the color was successfully changed
     */
    @CrossOrigin
    @PutMapping("/api/setPrimaryColor")
    public ResponseEntity<?> setPrimaryColor(@RequestParam(value = "colorHex", defaultValue = "NULL") String colorHex) {
        if(colorHex == null || colorHex.equals("NULL")) 
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Color is missing or invalid");
        try {
            @SuppressWarnings("unused")
            Color color = Color.decode(colorHex);
            // pass the new color to the database to update the user's primary color
            // return true;
            return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).build();
            // return ResponseEntity.ok().build();
        } catch (NumberFormatException e) {
            // handle invalid hex code
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid color format");
        }
    }

    /**
     * This method is to change the user's accent color
     * @param colorHex the new color in HEX format
     * @return if the color was successfully changed
     * @Unimplemented This method is not yet implemented.
     */

    public ResponseEntity<?> setAccentColor(String colorHex) {
        try {
            @SuppressWarnings("unused")
            Color color = Color.decode(colorHex);
            // pass the new color to the database to update the user's accent color
            return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).build();
        } catch (NumberFormatException e) {
            // handle invalid hex code
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid color format");
        }
    }

    /**
     * Save notifications settings for a user
     * @param userId the user's ID
     * @return True if the notification settings were successfully saved
     */
    @CrossOrigin
    @PostMapping("/api/updateNotificationSettings")
    public ResponseEntity<?> updateNotificationSettings(@RequestParam(value = "userId", defaultValue = "NULL") String userId, 
                                              @RequestParam(value = "email", defaultValue = "NULL") boolean email, 
                                              @RequestParam(value = "sms", defaultValue = "NULL") boolean sms, 
                                              @RequestParam(value = "institutionEmail", defaultValue = "NULL") boolean institutionEmail) {
        if(userId == null || userId.equals("NULL"))
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User ID is missing or invalid");
        if(validateUserId(userId).getStatusCode() != HttpStatus.OK)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No user with that Id exists");
        
        var user = scraper.getUser(userId);
        user.setNotificationSettings(email, sms, institutionEmail);
        if(scraper.saveUser(user))
            return ResponseEntity.ok(user);
        else
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving user");
    }

    /**
     * This method is to clear a user's notifications
     * @param userId
     * @return True if the notifications were successfully cleared
     */
    @CrossOrigin
    @PostMapping("/api/clearNotifications")
    public ResponseEntity<?> clearNotifications(@RequestParam(value = "userId", defaultValue = "NULL") String userId) {
        if(userId == null || userId.equals("NULL")) 
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User ID is missing or invalid");
        if(validateUserId(userId).getStatusCode() != HttpStatus.OK)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No user with that Id exists");
        
        var user = scraper.getUser(userId);
        user.clearNotifications();
        if(scraper.saveUser(user))
            return ResponseEntity.ok(user);
        else
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving user");
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
    public ResponseEntity<?> updatePreferredName(@RequestParam(value = "userId", defaultValue = "NULL") String userId, @RequestParam(value = "preferredName", defaultValue = "NULL") String preferredName) {
        if(preferredName == null || preferredName.equals("NULL")) 
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Preferred name is missing or invalid");
        if(validateUserId(userId).getStatusCode() != HttpStatus.OK)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No user with that Id exists");
        
        var user = scraper.getUser(userId);
        user.setPreferredName(preferredName);
        if(scraper.saveUser(user))
            return ResponseEntity.ok(user);
        else
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving user");
    }

    /**
     * This method updates a user's email
     * @param userId the user's ID
     * @param email the user's new email
     * @return True if the email was successfully updated
     * @throws ResponseStatusException if the user ID is missing or invalid, if the user is not found, or if there are multiple users with the same ID
     * @throws ResponseStatusException if the email is invalid
     */
    @CrossOrigin
    @PostMapping("/api/updateEmail")
    public ResponseEntity<?> updateEmail(@RequestParam(value = "userId", defaultValue = "NULL") String userId, @RequestParam(value = "email", defaultValue = "NULL") String email) {
        if(email == null || email.equals("NULL")) 
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email is missing or invalid");
        if(!User.testEmailRegex(email))
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid email format");
        if(validateUserId(userId).getStatusCode() != HttpStatus.OK)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No user with that Id exists");
        var user = scraper.getUser(userId);
        user.setEmail(email);
        if(scraper.saveUser(user))
            return ResponseEntity.ok(user);
        else
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving user");
    }

    /**
     * This method updates a user's phone number
     * @param userId the user's ID
     * @param phoneNumber the user's new phone number
     * @return True if the phone number was successfully updated
     */
    @CrossOrigin
    @PostMapping("/api/updatePhoneNumber")
    public ResponseEntity<?> updatePhoneNumber(@RequestParam(value = "userId", defaultValue = "NULL") String userId, @RequestParam(value = "phoneNumber", defaultValue = "NULL") String phoneNumber) {
        if(phoneNumber == null || phoneNumber.equals("NULL")) 
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Phone number is missing or invalid");
        if(validateUserId(userId).getStatusCode() != HttpStatus.OK)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No user with that Id exists");
        
        var user = scraper.getUser(userId);
        user.setMobilePhone(phoneNumber);
        if(scraper.saveUser(user))
            return ResponseEntity.ok(user);
        else
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving user");
    }

    /**
     * This method updates a user's mobile carrier
     * @param userId the user's ID
     * @param carrier the user's mobile carrier. List case insensitive: [AT&T/ATT, Verizon, T-Mobile/TMobile] 
     * @return Response entity with the updated user object or an error message
     */
    @CrossOrigin
    @PostMapping("/api/setMobileCarrier")
    public ResponseEntity<?> setMobileCarrier(@RequestParam(value = "userId", defaultValue = "NULL") String userId, 
                                              @RequestParam(value = "carrier", defaultValue = "NULL") String carrier) {
        if(carrier == null || carrier.equals("NULL")) 
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Carrier is missing or invalid");
        if(validateUserId(userId).getStatusCode() != HttpStatus.OK)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No user with that Id exists");
        
        var user = scraper.getUser(userId);
        if(!user.setMobileCarrier(carrier))
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid carrier. Valid carriers are: AT&T, Verizon, T-Mobile (case insensitive and special carriers optional)");
        if(scraper.saveUser(user))
            return ResponseEntity.ok(user);
        else
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving user");
    }

    /**
     * Sends a notification to a user
     * @param userId
     * @param message
     * @return
     */
    @CrossOrigin
    @GetMapping("/api/sendNotification")
    public ResponseEntity<?> sendNotification(@RequestParam(value = "userId", defaultValue = "NULL") String userId, 
                                              @RequestParam(value = "message", defaultValue = "NULL") String message) {
        if(userId == null || userId.equals("NULL"))
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User ID is missing or invalid");
        if(validateUserId(userId).getStatusCode() != HttpStatus.OK)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No user with that Id exists");
        if(message == null || message.equals("NULL"))
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Message is missing or invalid");
        if(!notificationManager.sendNotification(userId, message))
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error sending notification");
        return ResponseEntity.ok().build();
    }

    /* ---------------------- Private Methods ---------------------- */

    /**
     * Internal method to set an assignment as complete or incomplete
     * @param assID
     * @param isComplete
     * @return
     */
    private ResponseEntity<?> setAssignmentComplete(String assID, boolean isComplete) {
        var ass = scraper.findByAssignmentId(assID);
        if(ass == null || !ass.getId().equals(assID))
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Assignment not found.");
        ass.setComplete(isComplete);
        if(!scraper.saveAssignment(ass))
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Could not save assignment.");
        return ResponseEntity.ok().build();
    }

    private ResponseEntity<?> validateUserId(String userId) {
        if(userId == null || userId.equals("NULL"))
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User ID is missing or invalid");
        if(!scraper.isUserId(userId))
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No user with that Id exists");
        return ResponseEntity.ok().build();
    }

    private ResponseEntity<?> validateCourseId(String courseId) {
        if(courseId == null || courseId.equals("NULL"))
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Course ID is missing or invalid");
        if(!scraper.isCourseId(courseId))
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No course with that Id exists");
        return ResponseEntity.ok().build(); 
    }

    private ResponseEntity<?> validateAssignmentId(String assignmentId) {
        if(assignmentId == null || assignmentId.equals("NULL"))
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Assignment ID is missing or invalid");
        if(!scraper.isAssignmentId(assignmentId))
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No assignment with that Id exists");
        return ResponseEntity.ok().build();
    }

    private ResponseEntity<?> validateAssignmentParams(String title, String description, String dueDate, String userId, String courseId) {
        if(title == null || title.equals("NULL"))
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Title is missing or invalid");
        if(dueDate == null || dueDate.equals("NULL"))
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Due date is missing or invalid");
        if(userId == null || userId.equals("NULL"))
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User ID is missing or invalid");
        if(courseId == null || courseId.equals("NULL"))
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Course ID is missing or invalid");
        return ResponseEntity.ok().build();
    }
}

