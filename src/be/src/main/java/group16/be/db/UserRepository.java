package group16.be.db;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

public interface UserRepository extends MongoRepository<User, String> {
    @Query("{ 'userName' : ?0 }")
    public List<User> findByUserName(String userName);

    @Query("{$and: [ { userName: ?0, password: ?1 } ]}")
    public List<User> findByUserNameAndPassword(String userName, String password);
}
