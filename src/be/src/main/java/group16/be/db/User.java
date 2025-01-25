package group16.be.db;

import java.util.List;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Document(collection = "users")
public class User {
    
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
    private List<CourseId> courseIDs;

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
        contact.email = email;
        return true;
    }
    public boolean setMobilePhone(String mobilePhone) {
        if (contact == null) return false;
        contact.mobilePhone = mobilePhone;
        return true;
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

    /**
     * Toggles email notifications for the user
     * @return 
     */
    public void toggleEmailNotifications() {
        settings.setEmailNotifications(!settings.getEmailNotifications());
    }
    
    /**
     * Toggles institution email notifications for the user
     */
    public void toggleInstitutionEmailNotifications() {
        settings.setInstitutionEmailNotifications(!settings.getInstitutionEmailNotifications());
    }

    /**
     * Toggles SMS notifications for the user
     */
    public void toggleSmsNotifications() {
        settings.setSmsNotifications(!settings.getSmsNotifications());
    }


    // Getters and Setters for UserProfile

    public User () {
        super();
    }

    public List<CourseId> getCourseIDs() {
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
