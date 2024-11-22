package group16.be.db;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface TestRepository extends MongoRepository<Test, String> {
    // @Query("{ 'description' : ?0 }")
    // public Test findByDescription(String description);
    
    // @Query(fields="{'description' : 1}")
    // public List<Test> findAll();
}
