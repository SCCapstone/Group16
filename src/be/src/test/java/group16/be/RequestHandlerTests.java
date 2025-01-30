package group16.be;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import group16.be.db.Course;
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
        // Correct Login
        Map<String,String> response = handler.login(LOGIN_USER, LOGIN_PASS);
        assert(response.size() == 1
            && response.containsValue(EXPECTED_RESPONSE.get("id")));

        // Tests wrong password (expecting ResponseStatusException with HttpStatus.UNAUTHORIZED)
        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
            handler.login("osterholt", "wrongpassword");
        });
        // Verify the exception contains HttpStatus.UNAUTHORIZED
        assertEquals(HttpStatus.UNAUTHORIZED, exception.getStatusCode());

        // Tests wrong username (expecting ResponseStatusException with HttpStatus.UNAUTHORIZED)
        ResponseStatusException exception2 = assertThrows(ResponseStatusException.class, () -> {
            handler.login("wrongusername", "cameron1234");
        });
        // Verify the exception contains HttpStatus.UNAUTHORIZED
        assertEquals(HttpStatus.UNAUTHORIZED, exception2.getStatusCode());

        // Tests null username and password
        ResponseStatusException exception3 = assertThrows(ResponseStatusException.class, () -> {
            handler.login(null, null);
        });
        // Verify the exception contains HttpStatus.BAD_REQUEST
        assertEquals(HttpStatus.BAD_REQUEST, exception3.getStatusCode());

        // Tests empty username and password
        ResponseStatusException exception4 = assertThrows(ResponseStatusException.class, () -> {
            handler.login("", "");
        });
        // Verify the exception contains HttpStatus.BAD_REQUEST
        assertEquals(HttpStatus.UNAUTHORIZED, exception4.getStatusCode());

        // Tests abnormally large username and password
        String largeString = "A".repeat(1000000); // 1 million 'A's
        ResponseStatusException exception5 = assertThrows(ResponseStatusException.class, () -> {
            handler.login(largeString, largeString);
        });
        // Verify the exception contains HttpStatus.NOT_FOUND
        assertEquals(HttpStatus.UNAUTHORIZED, exception5.getStatusCode());
    }

    @Test
    void testGetCourses() {
        // Correct Login
        Map<String,String> response = handler.login(LOGIN_USER, LOGIN_PASS);
        assert(response.size() == 1
            && response.containsValue(EXPECTED_RESPONSE.get("id")));
        // Get courses
        List<Course> courses = handler.getCourses(EXPECTED_ID);
        assertTrue(courses.size() > 0);

        // Tests null user ID
        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
            handler.getCourses(null);
        });
        // Verify the exception contains HttpStatus.BAD_REQUEST
        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());

        // Tests empty user ID
        ResponseStatusException exception2 = assertThrows(ResponseStatusException.class, () -> {
            handler.getCourses("");
        });
        // Verify the exception contains HttpStatus.BAD_REQUEST
        assertEquals(HttpStatus.NOT_FOUND, exception2.getStatusCode());

        // Tests abnormally large user ID
        String largeString = "A".repeat(1000000); // 1 million 'A's
        ResponseStatusException exception3 = assertThrows(ResponseStatusException.class, () -> {
            handler.getCourses(largeString);
        });
        // Verify the exception contains HttpStatus.NOT_FOUND
        assertEquals(HttpStatus.NOT_FOUND, exception3.getStatusCode());
    }
}
