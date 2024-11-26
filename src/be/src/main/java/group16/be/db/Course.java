package group16.be.db;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "courses")
public class Course {
    @Id
    private String id;
    private String name;

    public String getId() {
        return id;
    }  
    public String getName() {
        return name;
    }
    
}
