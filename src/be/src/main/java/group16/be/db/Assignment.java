package group16.be.db;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "assignments")
public class Assignment {
    @Id
    private String id;
    public String getId() {
        return id;
    }
    public void randomUUID() {
        id = UUID.randomUUID().toString();
    }
    public Assignment setId(String id) {
        this.id = id;
        return this;
    }

    @Field("name")
    private String title;
    public String getTitle() {
        return title;
    }
    public Assignment setTitle(String title) {
        this.title = title;
        return this;
    }
    private String body;
    @Field("name")
    private String description;
    public String getDescription() {
        return description;
    }
    public Assignment setDescription(String description) {
        this.description = description;
        return this;
    }
    private LocalDateTime created;
    private LocalDateTime modified;
    private int position;
    private boolean hasChildren;
    private boolean hasGradebookColumns;
    private boolean hasAssociatedGroups;
    private boolean launchInNewWindow;
    private boolean reviewable;
    private Availability availability;
    public LocalDateTime getDueDate() {
        return availability.adaptiveRelease.end;
    }
    public Assignment setDueDate(LocalDateTime dueDate) {
        availability.adaptiveRelease.setEnd(dueDate);
        return this;
    }

    public static class Availability {
        private String available;
        private boolean allowGuests;
        private boolean allowObservers;
        private AdaptiveRelease adaptiveRelease;
    }
    public static class AdaptiveRelease {
        private LocalDateTime start;
        private LocalDateTime end;
        public void setEnd(LocalDateTime end) {
            this.end = end;
        }
    }

}
