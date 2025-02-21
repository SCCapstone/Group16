package group16.be.db;

import java.util.ArrayList;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface GradeRepository extends MongoRepository<Grade, String> {
    @Query("{ 'userId' : ?0 }")
    public ArrayList<Grade> findByUserId(String userId);

    @Query("{ 'assignmentId' : ?0 }")
    public ArrayList<Grade> findByAssignmentId(String assignmentId);
}
