package group16.be.db;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface CourseRepository extends MongoRepository<Course, String> {
    @Query("{ '_id' : ?0 }")
    public List<Course> findByUserId(String userId);
}
