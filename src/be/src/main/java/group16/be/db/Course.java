package group16.be.db;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "courses")
public class Course {
    @Id
    private String id;

    public String getId() {
        return id;
    }  
}
