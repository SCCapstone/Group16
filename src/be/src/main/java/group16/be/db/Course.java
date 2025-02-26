package group16.be.db;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "courses")
@SuppressWarnings("unused")
public class Course {
    

    @Id
    private String id;
    public String getId() {
        return id;
    }  

    private String uuid;
    private String externalId;
    private String dataSourceId;
    private String courseId;
    public String getExternalId() {
        return externalId;
    }

    public String getDataSourceId() {
        return dataSourceId;
    }

    public String getCourseId() {
        return courseId;
    }

    @Field("name")
    private String name;
    public String getName() {
        return name;
    }
    private String description;
    private LocalDateTime created;
    private LocalDateTime modified;
    private boolean organization;
    private String ultraStatus;
    private boolean allowGuests;
    private boolean allowObservers;
    private boolean closedComplete;
    private String termId;

    private Availability availability;
    private Enrollment enrollment;
    private Locale locale;

    private boolean hasChildren;
    private String externalAccessUrl;
    private String guestAccessUrl;

    public String getDescription() {
        return description;
    }

    public LocalDateTime getCreated() {
        return created;
    }

    public LocalDateTime getModified() {
        return modified;
    }

    public boolean isOrganization() {
        return organization;
    }

    public String getUltraStatus() {
        return ultraStatus;
    }

    public boolean isAllowGuests() {
        return allowGuests;
    }

    public boolean isAllowObservers() {
        return allowObservers;
    }

    public boolean isClosedComplete() {
        return closedComplete;
    }

    public String getTermId() {
        return termId;
    }

    public Availability getAvailability() {
        return availability;
    }

    public Enrollment getEnrollment() {
        return enrollment;
    }

    public Locale getLocale() {
        return locale;
    }

    public boolean isHasChildren() {
        return hasChildren;
    }

    public String getExternalAccessUrl() {
        return externalAccessUrl;
    }

    public String getGuestAccessUrl() {
        return guestAccessUrl;
    }

    // Nested classes for availability, enrollment, and locale fields
    public static class Availability {
        private String available;
        private Duration duration;

        public static class Duration {
            private String type;
        }

        public String getAvailable() {
            return available;
        }

        public Duration getDuration() {
            return duration;
        }
    }

    public static class Enrollment {
        private String type;
        private LocalDateTime start;
        private LocalDateTime end;
        public String getType() {
            return type;
        }
        public LocalDateTime getStart() {
            return start;
        }
        public LocalDateTime getEnd() {
            return end;
        }
    }

    public static class Locale {
        private String id;
        private boolean force;
        public String getId() {
            return id;
        }
        public boolean isForce() {
            return force;
        }
    }
    
    public void copyCourse(Course course) {
        this.name = course.getName();
        this.description = course.getDescription();
        this.termId = course.getTermId();
        this.availability = course.getAvailability();
        this.enrollment = course.getEnrollment();
        this.locale = course.getLocale();
        this.hasChildren = course.isHasChildren();
        this.externalAccessUrl = course.getExternalAccessUrl();
        this.guestAccessUrl = course.getGuestAccessUrl();
    }
}
