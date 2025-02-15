package group16.be.db;

import java.util.ArrayList;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface AssignmentRepository extends MongoRepository<Assignment, String> {
    @Query("{ '_id' : ?0 }")
    public Assignment findByAssignmentId(String assignmentId);
    
    @Query("{ 'userId' : ?0 }")
    public ArrayList<Assignment> findByUserId(String userId);
}
