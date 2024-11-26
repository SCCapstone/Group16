package group16.be.db;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

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
    private String studentId;
    private String gender;
    private String pronouns;
    private String birthDate; // ISO date-time format
    private String created; // ISO date-time format
    private String modified; // ISO date-time format
    private String lastLogin; // ISO date-time format

    private Availability availability;
    
    private Name name;
    public String getName() {
        return name.getName();
    }

    private Job job;
    private Contact contact;
    private Locale locale;
    private Avatar avatar;

    // Inner classes for nested JSON objects
    private static class Availability {
        private boolean available;

        // Getters and Setters
    }

    private static class Name {
        private String given;
        private String family;
        private String middle;
        private String other;
        private String suffix;
        private String title;
        private String preferredDisplayName;
        public String getName() {
            return preferredDisplayName;
        }

        // Getters and Setters
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
        private String businessPhone;
        private String businessFax;
        private String email;
        private String institutionEmail;
        private String webPage;

        // Getters and Setters
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
    private List<CourseId> courseIDs;

    // Getters and Setters for UserProfile

    public User () {
        super();
    }

    public List<CourseId> getCourseIDs() {
        return this.courseIDs;
    }
}
