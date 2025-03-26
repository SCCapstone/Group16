package group16.be.db;

import java.time.Instant;

import org.springframework.data.annotation.Id;

public class Notification implements Comparable<Notification> {
    @Id
    private String id;
    private String message;
    private String timestamp;

    public Notification(String message) {
        this.message = message;
        this.timestamp = Instant.now().toString();
    }

    public String getMessage() {
        return message;
    }

    public String getTimestamp() {
        return timestamp;
    }

    @Override
    public String toString() {
        return "Notification [message= " + message + ", timestamp= " + timestamp + "]";
    }

    @Override
    public int compareTo(Notification o) {
        return timestamp.compareTo(o.timestamp);
    }
}
