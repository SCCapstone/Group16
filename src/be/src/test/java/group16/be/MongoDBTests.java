package group16.be;

import java.util.ArrayList;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.scheduling.annotation.Async;

import group16.be.db.GradeRepository;
import group16.be.db.User;
import group16.be.db.UserRepository;

@SpringBootTest
public class MongoDBTests {
    @Autowired
    private UserRepository userRepo;

    @Autowired
    private GradeRepository gradeRepo;

    private final String LOGIN_USER = "osterholt";
    private final String EXPECTED_ID = "673fdd30cc2da4c3a3514fb7";

    /** 
     * Test the login APIScraper method
     */
    @Async
    @Test
    void testFindByUserNameAndPassword() {
        ArrayList<User> response = userRepo.findByUserNameAndPassword("osterholt", "cameron1234");
        assert(response.size() == 1 && response.get(0).getId().equals(EXPECTED_ID));
    }

    /** 
     * Test the find user by ID APIScraper method
     */
    @Async
    @Test 
    void testFindUserByUserId() {
        ArrayList<User> response = userRepo.findUserByUserId(EXPECTED_ID);
        assert(response.size() == 1 && response.get(0).getUserName().equals(LOGIN_USER));
    }

    @Async
    @Test
    void testGetGradesByUserId() {
        var response = gradeRepo.findByUserId(EXPECTED_ID);
        assert(response.size() > 0 && response.get(0).getUserId().equals(EXPECTED_ID));
    }
}
