package group16.be.db;

import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "courses")
@SuppressWarnings("unused")
public class Course {
    public Course(Course copyFrom,
                  String name, 
                  String description,
                  String termId) {
        super();
        copyFrom(copyFrom);
        this.name = name;
        this.description = description;
        this.termId = termId;
        this.created = Instant.now().toString();
        this.modified = Instant.now().toString();
    }
        
    private void copyFrom(Course copyFrom) {
        this.externalId = copyFrom.getExternalId();
        this.dataSourceId = copyFrom.getDataSourceId();
        this.courseId = copyFrom.getCourseId();
        this.name = copyFrom.getName();
        this.description = copyFrom.getDescription();
        this.created = Instant.now().toString();
        this.modified = Instant.now().toString();
        this.organization = copyFrom.isOrganization();
        this.ultraStatus = copyFrom.getUltraStatus();
        this.allowGuests = copyFrom.isAllowGuests();
        this.allowObservers = copyFrom.isAllowObservers();
        this.closedComplete = copyFrom.isClosedComplete();
        this.termId = copyFrom.getTermId();
        this.availability = copyFrom.getAvailability();
        this.enrollment = copyFrom.getEnrollment();
        this.locale = copyFrom.getLocale();
        this.hasChildren = copyFrom.isHasChildren();
        this.externalAccessUrl = copyFrom.getExternalAccessUrl();
        this.guestAccessUrl = copyFrom.getGuestAccessUrl();
    }
        
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
    private String created;
    private String modified;
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

    public String getCreated() {
        return created;
    }

    public String getModified() {
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
        private String start;
        private String end;
        public String getType() {
            return type;
        }
        public String getStart() {
            return start;
        }
        public String getEnd() {
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
