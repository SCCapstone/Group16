package group16.be;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.ArrayList;
import java.util.HashMap;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Async;
import org.springframework.web.server.ResponseStatusException;

import group16.be.db.Course;
import group16.be.db.GradeRepository;
import group16.be.db.User;
import group16.be.db.UserRepository;

@SpringBootTest
public class RequestHandlerTests {
    @Autowired
    private RequestHandler handler;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private GradeRepository gradeRepo;

    @Autowired
    private APIScraper scraper;

    private final String LOGIN_USER = "osterholt";
    private final String LOGIN_PASS = "cameron1234";
    private final String EXPECTED_ID = "673fdd30cc2da4c3a3514fb7";
    private final HashMap<String, String> EXPECTED_RESPONSE = new HashMap<String, String>() {{
        put("id", "673fdd30cc2da4c3a3514fb7");
    }};

    /** 
     * Test the login APIScraper method
     * TODO: Move this test to repository tester
     */
    @Async
    @Test
    void testFindByUserNameAndPassword() {
        ArrayList<User> response = userRepo.findByUserNameAndPassword("osterholt", "cameron1234");
        assert(response.size() == 1 && response.get(0).getId().equals(EXPECTED_ID));
    }

    /** 
     * Test the find user by ID APIScraper method
     * TODO: Move this test to repository tester
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

    @Async
    @Test
    void testLogin() {
        // Correct Login
        HashMap<String,String> response = handler.login(LOGIN_USER, LOGIN_PASS);
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

    @Async
    @Test
    void testGetCourses() {
        // Correct Login
        HashMap<String,String> response = handler.login(LOGIN_USER, LOGIN_PASS);
        assert(response.size() == 1
            && response.containsValue(EXPECTED_RESPONSE.get("id")));
        // Get courses
        ArrayList<Course> courses = handler.getCourses(EXPECTED_ID);
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

    @Async
    @Test
    void testCompleteAssignment() {
        // Not implemented yet.
        assertTrue(true);
    }

    @Async
    @Test
    void testGetAssignments() {
        // Correct Login
        var assignments = handler.getAssignments(EXPECTED_ID);
        assertTrue(assignments != null
                && assignments.size() > 0);
        
        // Tests null user ID
        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
            handler.getAssignments(null);
        });
        // Verify the exception contains HttpStatus.BAD_REQUEST
        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());

        // Tests empty user ID
        ResponseStatusException exception2 = assertThrows(ResponseStatusException.class, () -> {
            handler.getAssignments("");
        });
        // Verify the exception contains HttpStatus.NOT_FOUND
        assertEquals(HttpStatus.NOT_FOUND, exception2.getStatusCode());

        // Tests abnormally large user ID
        String largeString = "A".repeat(1000000); // 1 million 'A's
        ResponseStatusException exception3 = assertThrows(ResponseStatusException.class, () -> {
            handler.getAssignments(largeString);
        });
        // Verify the exception contains HttpStatus.NOT_FOUND
        assertEquals(HttpStatus.NOT_FOUND, exception3.getStatusCode());
    }

    @Async
    @Test
    void testGetGrades() {
        // Correct userID
        var grades = handler.getGrades(EXPECTED_ID);
        assertTrue(grades != null
                && grades.size() > 0);
    }   

    private final String REAL_USERID = "673fdd30cc2da4c3a3514fb7";
    private final String REAL_COURSEID = "67460db839c6b3085338aa81";
    private final String REAL_ASSIGNMENTID = "679bf4b631c4d665a59606ff";

    @Test
    void testIsIdMethods() {
        // Tests isUserId
        assertTrue(scraper.isUserId(REAL_USERID));
        assertFalse(scraper.isUserId(""));
        assertFalse(scraper.isUserId("123"));

        // Tests isCourseId
        assertTrue(scraper.isCourseId(REAL_COURSEID));
        assertFalse(scraper.isCourseId(""));
        assertFalse(scraper.isCourseId("123"));

        // Tests isAssignmentId
        assertTrue(scraper.isAssignmentId(REAL_ASSIGNMENTID));
        assertFalse(scraper.isAssignmentId(""));
        assertFalse(scraper.isAssignmentId("123"));
    }
}
