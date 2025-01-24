package group16.be.db;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

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
    @Field("courseIds")
    private List<CourseId> courseIDs;

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
    
    private static class Settings {
        private boolean emailNotifications;
        private boolean institutionEmailNotifications;
        private boolean smsNotifications;
    }

    // Getters and Setters for UserProfile

    public User () {
        super();
    }

    public List<CourseId> getCourseIDs() {
        return this.courseIDs;
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
        .append(",\n  name: ").append(name != null ? name.getName() : "null")
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
