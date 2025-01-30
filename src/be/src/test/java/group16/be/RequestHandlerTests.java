package group16.be;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import group16.be.db.User;
import group16.be.db.UserRepository;

@SpringBootTest
public class RequestHandlerTests {
    @Autowired
    private RequestHandler handler;

    @Autowired
    private APIScraper scraper; // Needed for dependancies of autowired classes

    @Autowired
    private UserRepository userRepo;

    private final String LOGIN_USER = "osterholt";
    private final String LOGIN_PASS = "cameron1234";
    private final String EXPECTED_ID = "673fdd30cc2da4c3a3514fb7";
    private final Map<String, String> EXPECTED_RESPONSE = new HashMap<String, String>() {{
        put("id", "673fdd30cc2da4c3a3514fb7");
    }};

    /** 
     * Test the login APIScraper method
     */
    @Test
    void testFindByUserNameAndPassword() {
        List<User> response = userRepo.findByUserNameAndPassword("osterholt", "cameron1234");
        assert(response.size() == 1 && response.get(0).getId().equals(EXPECTED_ID));
    }

    /** 
     * Test the find user by ID APIScraper method
     */
    @Test 
    void testFindUserByUserId() {
        List<User> response = userRepo.findUserByUserId(EXPECTED_ID);
        assert(response.size() == 1 && response.get(0).getUserName().equals(LOGIN_USER));
    }

    @Test
    void testLogin() {
        Map response = handler.login(LOGIN_USER, LOGIN_PASS);
        assert(response.size() == 1
            && response.containsValue(EXPECTED_RESPONSE.get("id")));
    }
}
