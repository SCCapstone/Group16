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
import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import group16.be.db.Assignment;
import group16.be.db.Course;
import group16.be.db.Grade;
import group16.be.db.User;

@RestController
public class RequestHandler {

    @Autowired
    private APIScraper scraper;

    @Autowired
    private static HeartbeatController heartbeatController;

    public RequestHandler() {
        
    }

    /**
     * This method is to login or register a new user
     * @param username 
     * @param password 
     * @return the user's ID if login was successful, null if login failed
     * @throws ResponseStatusException if the username or password is missing or invalid
     */
    @CrossOrigin //(origins = "http://localhost:4200")
    @PostMapping("/api/login")
    public HashMap<String, String> login(@RequestParam(value = "username", defaultValue = "NAME") String username, @RequestParam(value = "password", defaultValue = "NULL") String password) {
        if(username == null || username.equals("NAME"))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username is missing or invalid");
        if(password == null || password.equals("NULL"))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password is missing or invalid");
        HashMap<String, String> ret = new HashMap<>();

        String id = scraper.login(username, password); 
        if(id.startsWith("Error")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, id);
        }
        ret.put("id", id);
        return ret;
    }

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
     * This method is to get the user's courses
     * @param id the user's ID
     * @return the user's ArrayList of courses
     * @throws ResponseStatusException if the user ID is missing or invalid
     * @throws ResponseStatusException if no courses are found for the user
     */
    @CrossOrigin //(origins = "http://localhost:4200")
    @GetMapping("/api/getCourses")
    public ArrayList<Course> getCourses(@RequestParam(value = "userId", defaultValue = "NULL") String userId) {
        getUser(userId);
        //pass the user's ID to the database to get the user's courses
        var courses = scraper.getCourses(userId);
        if(courses == null) 
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No courses found for user");
        return courses;
    }

    /**
     * 
     * @param assID
     * @return
     */
    @CrossOrigin
    @GetMapping("/api/getCourseById")
    public Course getCourseById(@RequestParam(value = "courseId", defaultValue = "NULL") String courseId) {
        if(courseId == null || courseId.equals("NULL")) 
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Course ID is missing or invalid");
        var course = scraper.findByCourseId(courseId);
        if(course == null || course.getId() == null || course.getId().equals("NULL")) 
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No courses found for this ID");
        return course;
    }

    /**
     * This method is to complete assignments that are user made or not yet marked complete by blackboard
     * @param assID Assignment ID
     * @return if the assignment was successfully marked as complete
     * @Unimplemented This method is not yet implemented.
     */
    @CrossOrigin
    @PutMapping("/api/completeAssignment")
    public boolean completeAssignment(@RequestParam(value = "assID", defaultValue = "NULL") String assID) {
        if(assID == null || assID.equals("NULL")) 
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User ID is missing or invalid");
        //pass the assignment ID to the database to mark the assignment as completed
        if(!setAssignmentComplete(assID, true))
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not complete assignment");
        return true;
    }

    /**
     * This method is to uncomplete assignments that are user made or not yet marked complete by blackboard
     * @param assID
     * @param isComplete
     * @return
     */
    @CrossOrigin
    @PutMapping("/api/openAssignment")
    public boolean openAssignment(@RequestParam(value = "assID", defaultValue = "NULL") String assID) {
        if(assID == null || assID.equals("NULL")) 
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User ID is missing or invalid");
        //pass the assignment ID to the database to mark the assignment as incomplete
        if(!setAssignmentComplete(assID, false))
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not open assignment");
        return true;
    }

    private boolean setAssignmentComplete(String assID, boolean isComplete) {
        var ass = scraper.findByAssignmentId(assID);
        if(ass == null || !ass.getId().equals(assID))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Assignment not found.");
        ass.setComplete(isComplete);
        return scraper.saveAssignment(ass);
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
    public boolean addAssignmentWithoutId(@RequestParam(value = "title", defaultValue = "NULL") String title,
                                          @RequestParam(value = "description", defaultValue = "NULL") String description, 
                                          @RequestParam(value = "dueDate", defaultValue = "NULL") String dueDate,
                                          @RequestParam(value = "userId", defaultValue = "NULL") String userId, 
                                          @RequestParam(value = "courseId", defaultValue = "NULL") String courseId) {
        if(title == null || title.equals("NULL") || dueDate == null || dueDate.equals("NULL") || userId == null || userId.equals("NULL") || courseId == null || courseId.equals("NULL")) 
            return false;

        if(!scraper.isUserId(userId) || !scraper.isCourseId(courseId))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Course ID or assignment ID is invalid");

        // Search for existing Assignment.
        var assignments = scraper.getAssignments(userId);
        System.out.println("DEBUG: Assignments: ");
        for (Assignment assignment : assignments) {
            System.out.println(assignment.getTitle());
            if (assignment.getCourseId().equals(courseId) && assignment.getTitle().equalsIgnoreCase(title)) {
                // Assignment already exists. Returning HTTP error.
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Assignment already exists");
            }
        }

        boolean userCreated = true;
        var assignment = new Assignment(userId, courseId, title, description, dueDate, userCreated);
        var grade = new Grade(userId, courseId, assignment.getId(), -1.0);

        return scraper.saveAssignment(assignment) && scraper.saveGrade(grade);
    }

    /**
     * Edit Assignment's Details
     * @param userId
     * @return
     */
    @CrossOrigin
    @PutMapping("/api/editAssignment")
    public boolean editAssignment(@RequestParam(value = "userId", defaultValue = "NULL") String userId, 
                                  @RequestParam(value = "courseId", defaultValue = "NULL") String courseId, 
                                  @RequestParam(value = "assignmentId", defaultValue = "NULL") String assignmentId, 
                                  @RequestParam(value = "title", defaultValue = "NULL") String title, 
                                  @RequestParam(value = "description", defaultValue = "NULL") String description, 
                                  @RequestParam(value = "dueDate", defaultValue = "NULL") String dueDate) {
        if(title == null || title.equals("NULL") || dueDate == null || dueDate.equals("NULL") || userId == null || userId.equals("NULL") || courseId == null || courseId.equals("NULL") || assignmentId == null || assignmentId.equals("NULL")) 
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User ID, course ID, or assignment ID is missing or invalid");

        if(!scraper.isUserId(userId) || !scraper.isCourseId(courseId) || !scraper.isAssignmentId(assignmentId))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Course ID or assignment ID is invalid");

        var assignment = scraper.findByAssignmentId(assignmentId);
        if(assignment == null) 
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No assignments found for this ID");
        if(!assignment.getUserId().equals(userId))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Assignment does not match given user ID");
        if(!assignment.isUserCreated())
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User does not have permission to edit this assignment");

        // Modify the assignment
        assignment.editAssignment(title, description, dueDate, courseId);

        return scraper.saveAssignment(assignment);
    }

    @CrossOrigin
    @DeleteMapping("/api/removeAssignment") 
    public HttpStatus removeAssignment(@RequestParam(value = "assignmentId", defaultValue = "NULL") String assignmentId) {
        if(assignmentId == null || assignmentId.equals("NULL")) 
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Assignment ID is missing or invalid");
        var assignment = scraper.findByAssignmentId(assignmentId);
        var grade = scraper.getGradeByAssignmentId(assignmentId);
        if(assignment == null) 
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No assignments found for this ID");
        if(!assignment.isUserCreated())
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User does not have permission to delete this assignment");
        if(scraper.deleteAssignment(assignment) && scraper.deleteGrade(grade))
            return HttpStatus.OK;   
        else
            return HttpStatus.INTERNAL_SERVER_ERROR;
    }

    /**
     * Get all assignments from the database
     * @param userId the user's ID
     * @return a ArrayList of all assignments
     */
    @CrossOrigin
    @GetMapping("/api/getAssignments")
    public ArrayList<Assignment> getAssignments(@RequestParam(value = "userId", defaultValue = "NULL") String userId) {
        //pass the user's ID to the database to get the user's assignments
        if(userId == null || userId.equals("NULL")) 
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User ID is missing or invalid");
        var assignments = scraper.getAssignments(userId);
        if(assignments == null || assignments.size() == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No assignments found for user");
        }
        return assignments;
    }

    /**
     * Get assignment by ID
     * @param assignmentId the assignment's ID
     * @return the assignment
     */
    public Assignment getAssignmentById(@RequestParam(value = "assignmentId", defaultValue = "NULL") String assignmentId) {
        if(assignmentId == null || assignmentId.equals("NULL")) 
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Assignment ID is missing or invalid");
        var assignment = scraper.findByAssignmentId(assignmentId);
        if(assignment == null || assignment.getId() == null || assignment.getId().equals("NULL")) 
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No assignments found for this ID");
        return assignment;
    }

    /**
     * Get all grades for current user
     * @param userId the user's ID
     * @return 
     */
    @CrossOrigin
    @GetMapping("/api/getGrades")
    public ArrayList<Grade> getGrades(@RequestParam(value = "userId", defaultValue = "NULL") String userId) {
        getUser(userId);
        // pass the user's ID to the database to get the user's grades
        var grades = scraper.getGrades(userId);
        if(grades == null) 
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No grades found for user");
        return grades;
    }
    
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
            @SuppressWarnings("unused")
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
     * @Unimplemented This method is not yet implemented.
     */

    public static boolean setAccentColor(String colorHex) {
        try {
            @SuppressWarnings("unused")
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
        var users = scraper.getUser(userId);
        if(users == null || users.size() == 0) 
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        if(users.size() > 1)
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Multiple users with the same ID");
        return users.get(0);
    }

    /**
     * Save notifications settings for a user
     * @param userId the user's ID
     * @return True if the notification settings were successfully saved
     */
    @CrossOrigin
    @PostMapping("/api/updateNotificationSettings")
    public boolean updateNotificationSettings(@RequestParam(value = "userId", defaultValue = "NULL") String userId, @RequestParam(value = "email", defaultValue = "NULL") boolean email, @RequestParam(value = "sms", defaultValue = "NULL") boolean sms, @RequestParam(value = "institutionEmail", defaultValue = "NULL") boolean institutionEmail) {
        System.out.println("DEBUG: updateNotificationSettings User ID: " + userId + " Email: " + email + " SMS: " + sms + " Institution Email: " + institutionEmail);
        User user = getUser(userId);
        user.setNotificationSettings(email, sms, institutionEmail);
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
     * @throws ResponseStatusException if the email is invalid
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

    /**
     * Set grade for a user
     * @param userId the user's ID
     * @param courseId the course's ID
     * @param assignmentId the assignment's ID
     * @param percent the grade percentage
     * @return True if the grade was successfully set
     * @throws ResponseStatusException if the user ID, course ID, or assignment ID is missing or invalid
     */
    @CrossOrigin
    @PostMapping("/api/setGrade")
    public HttpStatus setGrade(@RequestParam(value = "gradeId", defaultValue = "NULL") String gradeId,  
                               @RequestParam(value = "percent", defaultValue = "NULL") double percent) {
        if(gradeId == null || gradeId.equals("NULL"))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Grade ID is missing or invalid");
        if(percent < 0)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Percent is invalid");

        
        var grade = scraper.getGradeByGradeId(gradeId);
        if(grade == null)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Grade not found");
        
        var assignment = scraper.findByAssignmentId(grade.getAssignmentId());
        if(!assignment.isUserCreated()) 
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User does not have permission to edit this grade");
        
        grade.setPercent(percent);
        if(scraper.saveGrade(grade))
            return HttpStatus.OK;
        else
            return HttpStatus.INTERNAL_SERVER_ERROR;
    }

    @CrossOrigin
    @GetMapping("/api/debugCamDaBest")
    public String debugCamDaBest() {
        return "Cam Da Best";
    }
}

