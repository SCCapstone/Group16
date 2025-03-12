package group16.be;

import java.io.File;
import java.io.FileWriter;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.mongodb.client.model.changestream.ChangeStreamDocument;

import group16.be.db.User;

/**
 * This class is responsible for managing notifications.
 * It recieves updates from the MongoChangeListener and sends notifications to the users.
 */

@Component
public class NotificationManager {
    @Autowired
    private APIScraper scraper;

    public void parseChange(ChangeStreamDocument<Document> change) {
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
        var ret = true;

        if (user.getEmailNotifications()) {
            //TODO: Send email.
        }
        if (user.getInstitutionEmailNotifications()) {
            //TODO: Send university email.
        }
        if (user.getSmsNotifications()) {
            //TODO: Send SMS.
        }
        if(ret) {
            scraper.saveUser(user);
        }
        return ret; 
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
            // TODO: Are we sending the percent in the notification?
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
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'parseDelete'");
    }

    private void parseReplace(ChangeStreamDocument<Document> change) {
        // try {
        //     FileWriter fw = new FileWriter(new File("updateGrade.json"));
        //     fw.write(change.getFullDocumentBeforeChange().toJson());
        //     fw.close();
        // } catch (Exception e) {
        //     // TODO: handle exception
        // }

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
}
