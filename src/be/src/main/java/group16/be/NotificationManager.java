package group16.be;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.mongodb.client.model.changestream.ChangeStreamDocument;

import group16.be.db.Assignment;
import group16.be.db.User;

/**
 * This class is responsible for managing notifications.
 * It recieves updates from the MongoChangeListener and sends notifications to the users.
 */

@Component
public class NotificationManager {
    @Autowired
    private APIScraper scraper;

    @Autowired
    private EmailController emailController;

    public void parseChange(ChangeStreamDocument<Document> change) {
        System.out.println("DEBUG: parseChange: " + change.toString());
        switch (change.getOperationType().getValue()) {
            case "insert":
                System.out.println("DEBUG: INSERT");
                parseInsert(change);
                break;
            case "update":
                System.out.println("DEBUG: UPDATE");
                parseUpdate(change);
                break;
            case "delete":
                System.out.println("DEBUG: DELETE");
                parseDelete(change);
                break;
            case "replace":
                System.out.println("DEBUG: REPLACE");
                parseReplace(change);
                break;
            
            default:
                throw new UnsupportedOperationException("Unsupported operation type: " + change.getOperationType().toString());
        }
    }

    public boolean sendNotification(String userId, String message) {
        var user = scraper.getUser(userId);
        if (user == null) {
            return false;
        }
        return sendNotification(user, message);
    }

    public boolean sendNotification(User user, String message) {
        user.addNotification(message);

        if (user.getEmailNotifications()) {
            emailController.sendEmail(user.getEmail(), "Notification from ClassMATE", message);
        }
        if (user.getInstitutionEmailNotifications()) {
            emailController.sendEmail(user.getInstitutionEmail(), "Notification from ClassMATE", message);
        }
        if (user.getSmsNotifications()) {
            // Not implemented yet
        }
        
        return scraper.saveUser(user);
    }

    public boolean clearNotifications(String userId) {
        var user = scraper.getUser(userId);
        if (user == null) {
            return false;
        }
        return clearNotifications(user);
    }

    public boolean clearNotifications(User user) {
        user.clearNotifications();
        return scraper.saveUser(user);
    }
    
    /**
     * Notifications need to be sent for the following changes:
     * New Grade (Non-User Created)
     * New Assignment (Non-User Created)
     * @param change
     */
    private void parseInsert(ChangeStreamDocument<Document> change) {
        var changeId = change.getDocumentKey().get("_id").toString();
        var changeCollection = change.getNamespace().getCollectionName();
        
        if(changeCollection.equals("grades")) {
            var grade = scraper.getGradeByGradeId(changeId);
            if (grade == null) {
                return;
            }
            var assignment = scraper.findByAssignmentId(grade.getAssignmentId());
            if(assignment.isUserCreated()) {
                return;
            }
            sendNotification(grade.getUserId(), "New grade added for assignment \"" + assignment.getTitle() + "\"");
        } 
        else if(changeCollection.equals("assignments")) {
            var assignment = scraper.findByAssignmentId(changeId);
            if (assignment == null || assignment.isUserCreated()) {
                return;
            }
            sendNotification(assignment.getUserId(), "New assignment added: " + assignment.getTitle());
        }
    }
    
    /**
     * Notifications need to be sent for the following changes:
     * User updated Setting successfully
     * Updated Grade (Non-User Created)
     * Change in Assignment Due Date
     * Change in Assignment Title/Description
     * @param change
     */
    private void parseUpdate(ChangeStreamDocument<Document> change) {
        var changeId = change.getDocumentKey().get("_id").asObjectId().getValue().toString();
        System.out.println("DEBUG: CHANGE ID: " + changeId);
        var changeCollection = change.getNamespace().getCollectionName();
        System.out.println("DEBUG: CHANGE COLLECTION: " + changeCollection);

        if(changeCollection.equals("grades")){
            var grade = scraper.getGradeByGradeId(changeId);
            if (grade == null) {
                return;
            }
            var user = scraper.getUser(grade.getUserId());
            if (user == null) {
                return;
            }
            sendNotification(user, "GRADE UPDATED " + grade.getPercent());
        }        
    }
    
    private void parseDelete(ChangeStreamDocument<Document> change) {
        throw new UnsupportedOperationException("Unimplemented method 'parseDelete'");
    }

    private void parseReplace(ChangeStreamDocument<Document> change) {
        var changeId = change.getDocumentKey().get("_id").asObjectId().getValue().toString();
        System.out.println("DEBUG: CHANGE ID: " + changeId);
        var changeCollection = change.getNamespace().getCollectionName();
        System.out.println("DEBUG: CHANGE COLLECTION: " + changeCollection);

        if(changeCollection.strip().equalsIgnoreCase("grades")){
            var grade = scraper.getGradeByGradeId(changeId);
            if (grade == null) {
                return;
            }
            var user = scraper.getUser(grade.getUserId());
            if (user == null) {
                return;
            }
            sendNotification(user, "GRADE UPDATED " + grade.getPercent());
        }
    }

    public void notifyDueSoonAssignments() {
        Instant now = Instant.now(); // Current UTC time
        // Get all users
        var users = scraper.getAllUsers();
        for (User user : users) {
            // Get all assignments for the user
            var assignments = scraper.getAssignments(user.getId());
            var dueTomorrow = new ArrayList<String>();
            var dueToday = new ArrayList<String>();
            for (Assignment assignment : assignments) {
                if(assignment.isComplete())
                    continue;
                // Check if the assignment is due soon
                var isWithin24hours = assignment.getDueDateAsDate().isBefore(now.plus(Duration.ofHours(24)));
                var isWithin48hours = assignment.getDueDateAsDate().isBefore(now.plus(Duration.ofHours(48))) && assignment.getDueDateAsDate().isAfter(now.plus(Duration.ofHours(24)));
                if (isWithin24hours) {
                    dueToday.add(assignment.getTitle());
                } else if (isWithin48hours) {
                    dueTomorrow.add(assignment.getTitle());
                }
            }
            // Send notifications
            if (dueToday.size() > 0) {
                String message = "You have the following assignments due today: " + String.join(",\n", dueToday);
                sendNotification(user, message);
            }
            if (dueTomorrow.size() > 0) {
                String message = "You have the following assignments due tomorrow: " + String.join(",\n", dueTomorrow);
                sendNotification(user, message);
            }
        }
    }
}
