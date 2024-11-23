/**
 * DEPRICATED TESTS Nov 22, 2024
 */

package group16.be.db;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "tests")
public class TestClass {
    @Id
    private String id;
    private LocalDateTime creationDate;
    private String description;

    public TestClass(String description) {
        this.creationDate = LocalDateTime.now();
        this.description = description;
    }
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public LocalDateTime getCreationDate() {
        return creationDate;
    }
    public void setCreationDate(LocalDateTime creationDate) {
        this.creationDate = creationDate;
    }
    public String getDescription() {
        return description;
    }
}
