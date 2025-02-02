package group16.be.db;

import java.util.UUID;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Document(collection = "assignments")
public class Assignment {
    public Assignment() {
        availability = new Availability();
        availability.adaptiveRelease = new AdaptiveRelease();
        this.userCreated = false;
    }
    public Assignment(String userId, String courseId, String title, String description, String dueDate, boolean userCreated) {
        this();
        this.id = UUID.randomUUID().toString();
        setTitle(title);
        setDescription(description);
        setDueDate(dueDate);
        setUserId(userId);
        setCourseId(courseId);
        this.userCreated = userCreated;
    }
    @Id
    public String id;
    public String getId() {
        return id;
    }
    public Assignment randomUUID() {
        id = UUID.randomUUID().toString();
        return this;
    }
    public Assignment setId(String id) {
        this.id = id;
        return this;
    }
    @Field("userId")
    public String userId;
    public String getUserId() {
        return userId;
    }
    public Assignment setUserId(String userId) {
        this.userId = userId;
        return this;
    }
    private boolean userCreated;
    public boolean isUserCreated() {
        return userCreated;
    }
    @Field("courseId")
    public String courseId;
    public String getCourseId() {
        return courseId;
    }
    public Assignment setCourseId(String courseId) {
        this.courseId = courseId;
        return this;
    }
    @Field("title")
    public String title;
    public String getTitle() {
        return title;
    }
    public Assignment setTitle(String title) {
        this.title = title;
        return this;
    }
    public String body;
    @Field("description")
    public String description;
    public String getDescription() {
        return description;
    }
    public Assignment setDescription(String description) {
        this.description = description;
        return this;
    }
    public String created;
    public String modified;
    public int position;
    public boolean hasChildren;
    public boolean hasGradebookColumns;
    public boolean hasAssociatedGroups;
    public boolean launchInNewWindow;
    public boolean reviewable;
    public Availability availability;
    @JsonIgnore
    public String getDueDate() {
        return availability.adaptiveRelease.end;
    }
    public Assignment setDueDate(String dueDate) {
        availability.adaptiveRelease.setEnd(dueDate);
        return this;
    }

    public static class Availability {
        public String available;
        public boolean allowGuests;
        public boolean allowObservers;
        public AdaptiveRelease adaptiveRelease;
    }
    public static class AdaptiveRelease {
        public String start;
        public String end;
        public void setEnd(String end) {
            this.end = end;
        }
    }
}