package group16.be.db;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.PriorityQueue;
import java.util.Queue;
import java.util.regex.Pattern;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Document(collection = "users")
@SuppressWarnings("unused")
public class User {
    private final String[] CARRIERS = { "AT&T", "T-Mobile", "Verizon" };

    public User(String userId, String username, String password) {
        this.id = userId;
        this.userName = username;
        this.password = password;
    }
    
    @Id
    private String id;
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    private String uuid;
    private String dataSourceId;
    private String userName;
    public String getUserName() {
        return userName;
    }

    @JsonIgnore
    @Field("password")
    private String password;
    public boolean checkPassword(String password) {
        return this.password.equals(password);
    }
    public void setPassword(String password) {
        this.password = password;
    }
    
    private String studentId;
    private String gender;
    private String pronouns;
    private String birthDate; // ISO date-time format
    private String created; // ISO date-time format
    private String modified; // ISO date-time format
    private String lastLogin; // ISO date-time format

    private Availability availability;

    @Field("settings")
    private Settings settings;
    
    
    private Name name;
    public Name getName() {
        return name;
    }

    private Job job;
    private Contact contact;
    private Locale locale;
    private Avatar avatar;
    @Field("courseIds")
    private ArrayList<CourseId> courseIDs;
    private PriorityQueue<Notification> notifications;

    public PriorityQueue<Notification> getNotifications() {
        if(notifications == null) 
            notifications = new PriorityQueue<>();
        return notifications;
    }
    public boolean clearNotifications() {
        if (notifications == null) notifications = new PriorityQueue<>();
        notifications.clear();
        return true;        
    }

    // Inner classes for nested JSON objects
    private static class Availability {
        private boolean available;

        // Getters and Setters
    }

    private static class Name {
        private String given;
        public String getGiven() {
            return given;
        }
        private String family;
        public String getFamily() {
            return family;
        }
        private String middle;
        private String other;
        private String suffix;
        private String title;
        private String preferredDisplayName;
        public String getPreferredDisplayName() {
            return preferredDisplayName;
        }

        // Getters and Setters
    }
    public boolean setPreferredName(String preferredName) {
        if (name == null) return false;
        name.preferredDisplayName = preferredName;
        return true;
    }

    private static class Job {
        private String title;
        private String department;
        private String company;

        // Getters and Setters
    }

    private static class Contact {
        private String homePhone;
        private String mobilePhone;
        public String getMobilePhone() { return mobilePhone; }
        private String carrier;
        public String getMobileCarrier() { return carrier; }
        private String businessPhone;
        private String businessFax;
        private String email;
        public String getEmail() { return email; }
        private String institutionEmail;
        public String getInstitutionEmail() { return institutionEmail; }
        private String webPage;

        // Getters and Setters
    }
    public Contact getContact() {
        return contact;
    }
    public boolean setEmail(String email) {
        if (contact == null) return false;
        if (!testEmailRegex(email)) return false;
        contact.email = email;
        return true;
    }
    public static boolean testEmailRegex(String email) {
        String regexPattern = "^(?=.{1,64}@)[A-Za-z0-9_-]+(\\.[A-Za-z0-9_-]+)*@" 
            + "[^-][A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z]{2,})$";
        return Pattern.compile(regexPattern)
            .matcher(email)
            .matches();
    }
    public String getEmail() {
        if (contact == null) return null;
        return contact.getEmail();
    }
    public String getInstitutionEmail() {
        if (contact == null) return null;
        return contact.getInstitutionEmail();
    }

    public boolean setMobilePhone(String mobilePhone) {
        if (contact == null) return false;
        contact.mobilePhone = mobilePhone;
        return true;
    }

    public String getMobileCarrier() {
        if (contact == null) return null;
        return contact.getMobileCarrier();
    }

    public boolean setMobileCarrier(String carrier) {
        if (contact == null) 
            contact = new Contact();
        if (carrier == null || carrier.length() == 0) return false;
        boolean validCarrier = false;
        for (String c : CARRIERS) {
            var cNoSpecial = c.replaceAll("[&-]", "");
            if (cNoSpecial.equalsIgnoreCase(carrier) || c.equalsIgnoreCase(carrier)) {
                validCarrier = true;
                contact.carrier = c;
                break;
            }
        }
        return validCarrier;
    }


    private static class Locale {
        private String id;
        private String calendar;
        private String firstDayOfWeek;

        // Getters and Setters
    }

    private static class Avatar {
        private String viewUrl;
        private String source;
        private String uploadId;
        private String resourceId;

        // Getters and Setters
    }

    public static class CourseId {
        private String courseId;
        public String getCourseId() {
            return courseId;
        }
    }


    public void addNotification(String message) {
        // if notifications is empty, initalize the queue
        System.out.println("Adding notification: " + message);
        if (notifications == null) 
            notifications = new PriorityQueue<>();
        Notification notification = new Notification(message);
        notifications.add(notification);
        System.out.println("DEBUG: User addNotification: " + notification.getMessage());
    }
    
    private static class Settings {
        private Boolean emailNotifications;
        public boolean getEmailNotifications() { return emailNotifications; }
        public void setEmailNotifications(boolean emailNotifications) { this.emailNotifications = emailNotifications; }
        
        private Boolean institutionEmailNotifications;
        public boolean getInstitutionEmailNotifications() { return institutionEmailNotifications; }
        public void setInstitutionEmailNotifications(boolean institutionEmailNotifications) { this.institutionEmailNotifications = institutionEmailNotifications; }
        
        private Boolean smsNotifications;
        public boolean getSmsNotifications() { return smsNotifications; }
        public void setSmsNotifications(boolean smsNotifications) { this.smsNotifications = smsNotifications; }
    }

    public boolean setNotificationSettings(boolean email, boolean sms, boolean institutionEmail) {
        if (settings == null) return false;
        settings.setEmailNotifications(email);
        settings.setSmsNotifications(sms);
        settings.setInstitutionEmailNotifications(institutionEmail);
        return true;
    }

    public boolean getEmailNotifications() {
        if (settings == null) return false;
        return settings.getEmailNotifications();
    }

    public boolean getInstitutionEmailNotifications() {
        if (settings == null) return false;
        return settings.getInstitutionEmailNotifications();
    }

    public boolean getSmsNotifications() {
        if (settings == null) return false;
        return settings.getSmsNotifications();
    }


    // Getters and Setters for UserProfile

    public User () {
        super();
    }

    public ArrayList<CourseId> getCourseIDs() {
        return this.courseIDs;
    }

    public Settings getSettings() {
        return settings;
    }


    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("User {")
        .append("\n  id: ").append(id)
        .append(",\n  uuid: ").append(uuid)
        .append(",\n  dataSourceId: ").append(dataSourceId)
        .append(",\n  userName: ").append(userName)
        .append(",\n  studentId: ").append(studentId)
        .append(",\n  gender: ").append(gender)
        .append(",\n  pronouns: ").append(pronouns)
        .append(",\n  birthDate: ").append(birthDate)
        .append(",\n  created: ").append(created)
        .append(",\n  modified: ").append(modified)
        .append(",\n  lastLogin: ").append(lastLogin)
        .append(",\n  availability: ").append(availability != null ? availability.available : "null")
        .append(",\n  name: ").append(name != null ? name.getPreferredDisplayName() : "null")
        .append(",\n  job: ").append(job != null ? job.toString() : "null")
        .append(",\n  contact: ").append(contact != null ? contact.toString() : "null")
        .append(",\n  locale: ").append(locale != null ? locale.toString() : "null")
        .append(",\n  avatar: ").append(avatar != null ? avatar.toString() : "null")
        .append(",\n  courseIDs: ").append(courseIDs != null ? formatCourseIDs(courseIDs) : "null")
        .append("\n}");
        return sb.toString();
    }

    public String simpleToString() {
        String notificationString = "";
        for(var notification : notifications) {
            notificationString += "\t    { " + notification.getMessage() + " }";
        }
        return "User:"
        + "\t  id: " + id
        + ",\t  userName: " + userName
        + ",\t  studentId: " + studentId
        + ",\t  notifications: " + notificationString;
    }

    private String formatCourseIDs(List<CourseId> courseIDs) {
        if (courseIDs == null || courseIDs.isEmpty()) return "[]";
        StringBuilder sb = new StringBuilder("[");
        for (CourseId courseId : courseIDs) {
            sb.append("\n    { courseId: ").append(courseId.getCourseId()).append(" },");
        }
        sb.deleteCharAt(sb.length() - 1); // Remove the last comma
        sb.append("\n  ]");
        return sb.toString();
    }



}
