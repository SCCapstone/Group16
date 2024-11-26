package group16.be.db;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "courses")
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

    // Nested classes for availability, enrollment, and locale fields
    public static class Availability {
        private String available;
        private Duration duration;

        public static class Duration {
            private String type;
        }
    }

    public static class Enrollment {
        private String type;
        private LocalDateTime start;
        private LocalDateTime end;
    }

    public static class Locale {
        private String id;
        private boolean force;
    }
}
