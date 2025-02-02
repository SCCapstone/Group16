package group16.be.db;

import java.util.ArrayList;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface UserRepository extends MongoRepository<User, String> {
    @Query("{ 'userName' : ?0 }")
    public ArrayList<User> findByUserName(String userName);

    @Query("{$and: [ { userName: ?0, password: ?1 } ]}")
    public ArrayList<User> findByUserNameAndPassword(String userName, String password);

    @Query("{'_id' : ObjectId( ?0 )}")
    public ArrayList<User> findUserByUserId(String userId); 
}
