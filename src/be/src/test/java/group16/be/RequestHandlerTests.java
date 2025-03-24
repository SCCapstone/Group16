package group16.be;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.ArrayList;
import java.util.HashMap;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Async;

import group16.be.db.Assignment;
import group16.be.db.Course;
import group16.be.db.User;

@SpringBootTest
public class RequestHandlerTests {
    @Autowired
    private RequestHandler handler;

    @Autowired
    private APIScraper scraper;

    private final String LOGIN_USER = "osterholt";
    private final String LOGIN_PASS = "cameron1234";
    private final String EXPECTED_ID = "673fdd30cc2da4c3a3514fb7";

    private final String REAL_USERID = "673fdd30cc2da4c3a3514fb7";
    private final String REAL_COURSEID = "67460db839c6b3085338aa81";
    private final String REAL_ASSIGNMENTID = "674d133818689e57b9e2e33d";
    private final HashMap<String, String> EXPECTED_RESPONSE = new HashMap<String, String>() {{
        put("id", "673fdd30cc2da4c3a3514fb7");
    }};

    @Async
    @Test
    void testLogin() {
        // Correct Login
        try {
            var body = handler.login(LOGIN_USER, LOGIN_PASS).getBody();
            if(body == null) 
                throw new NullPointerException("Expected HashMap<String, String> but found: null");
            if (body instanceof HashMap) {
                @SuppressWarnings("unchecked")
                HashMap<String, String> response = (HashMap<String, String>) body;
                assertTrue(response.get("id").equals(EXPECTED_RESPONSE.get("id")));
            }
            else {
                throw new ClassCastException("Expected HashMap<String, String> but found: " + body.getClass().getName());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        // Tests wrong password (expecting ResponseStatusException with HttpStatus.UNAUTHORIZED)
        var response = handler.login("osterholt", "wrongpassword");
        // Verify the exception contains HttpStatus.UNAUTHORIZED
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());

        // Tests wrong username (expecting ResponseStatusException with HttpStatus.UNAUTHORIZED)
        var response2 = handler.login("wrongusername", "cameron1234");
        // Verify the exception contains HttpStatus.UNAUTHORIZED
        assertEquals(HttpStatus.UNAUTHORIZED, response2.getStatusCode());

        // Tests null username and password (expecting ResponseStatusException with HttpStatus.BAD_REQUEST)
        var response3 = handler.login(null, null);
        // Verify the exception contains HttpStatus.BAD_REQUEST
        assertEquals(HttpStatus.BAD_REQUEST, response3.getStatusCode());

        // Tests empty username and password (expecting ResponseStatusException with HttpStatus.BAD_REQUEST)
        var response4 = handler.login("", "");
        // Verify the exception contains HttpStatus.BAD_REQUEST
        assertEquals(HttpStatus.UNAUTHORIZED, response4.getStatusCode());

        // Tests abnormally large username and password (expecting ResponseStatusException with HttpStatus.UNAUTHORIZED)
        String largeString = "A".repeat(1000000); // 1 million 'A's
        var response5 = handler.login(largeString, largeString);
        // Verify the exception contains HttpStatus.UNAUTHORIZED
        assertEquals(HttpStatus.UNAUTHORIZED, response5.getStatusCode());
    }

    @Async
    @Test
    void testGetCourses() {
        // Get courses
        var courseResponse = handler.getCourses(EXPECTED_ID);
        assertTrue(courseResponse != null);
        assertTrue(courseResponse.getStatusCode() == HttpStatus.OK);
        assertTrue(courseResponse.getBody() != null);
        assertTrue(courseResponse.getBody() instanceof ArrayList);
        @SuppressWarnings("unchecked")
        ArrayList<Course> courses = (ArrayList<Course>) courseResponse.getBody();
        assertTrue(courses != null && courses.size() > 0);

        // Tests null user ID
        var exception = handler.getCourses(null);
        // Verify the exception contains HttpStatus.BAD_REQUEST
        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());

        var exception2 = handler.getCourses("");
        // Verify the exception contains HttpStatus.BAD_REQUEST
        assertEquals(HttpStatus.BAD_REQUEST, exception2.getStatusCode());

        // Tests abnormally large user ID
        String largeString = "A".repeat(1000000); // 1 million 'A's
        var exception3 = handler.getCourses(largeString);
        // Verify the exception contains HttpStatus.NOT_FOUND
        assertEquals(HttpStatus.BAD_REQUEST, exception3.getStatusCode());
    }

    @Async
    @Test
    void testGetUser() {
        // Correct userID
        var userResponse = handler.getUser(EXPECTED_ID);
        assertTrue(userResponse != null);
        assertTrue(userResponse.getStatusCode() == HttpStatus.OK);
        assertTrue(userResponse.getBody() != null);
        assertTrue(userResponse.getBody() instanceof User);
        User user = (User) userResponse.getBody();
        assertTrue(user != null);
        assertEquals(user.getId(), EXPECTED_ID);

        // Tests null user ID
        var exception = handler.getUser(null);
        // Verify the exception contains HttpStatus.BAD_REQUEST
        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());

        // Tests empty user ID
        var exception2 = handler.getUser("");
        // Verify the exception contains HttpStatus.BAD_REQUEST
        assertEquals(HttpStatus.BAD_REQUEST, exception2.getStatusCode());

        // Tests abnormally large user ID
        String largeString = "A".repeat(1000000); // 1 million 'A's
        var exception3 = handler.getUser(largeString);
        // Verify the exception contains HttpStatus.NOT_FOUND
        assertEquals(HttpStatus.BAD_REQUEST, exception3.getStatusCode());
    }

    @Async
    @Test
    void testGetAssignments() {
        // Correct Login
        var assignmentsResponse = handler.getAssignments(EXPECTED_ID);
        assertTrue(assignmentsResponse != null);
        assertTrue(assignmentsResponse.getStatusCode() == HttpStatus.OK);
        assertTrue(assignmentsResponse.getBody() != null);
        assertTrue(assignmentsResponse.getBody() instanceof ArrayList);
        @SuppressWarnings("unchecked")
        ArrayList<Assignment> assignments = (ArrayList<Assignment>) assignmentsResponse.getBody();
        assertTrue(assignments != null && assignments.size() > 0);
        
        // Tests null user ID
        var response = handler.getAssignments(null);

        // Verify the exception contains HttpStatus.BAD_REQUEST
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());

        // Tests empty user ID
        var response2 = handler.getAssignments("");
        // Verify the exception contains HttpStatus.NOT_FOUND
        assertEquals(HttpStatus.BAD_REQUEST, response2.getStatusCode());

        // Tests abnormally large user ID
        String largeString = "A".repeat(1000000); // 1 million 'A's
        var response3 = handler.getAssignments(largeString);
        // Verify the exception contains HttpStatus.NOT_FOUND
        assertEquals(HttpStatus.BAD_REQUEST, response3.getStatusCode());

        //TODO: Test user without assignments
    }

    @Async
    @Test
    void testGetGrades() {
        // Correct userID
        var gradesResponse = handler.getGrades(EXPECTED_ID);
        assertTrue(gradesResponse != null);
        assertTrue(gradesResponse.getStatusCode() == HttpStatus.OK);
        assertTrue(gradesResponse.getBody() != null);
        assertTrue(gradesResponse.getBody() instanceof ArrayList);
        @SuppressWarnings("unchecked")
        ArrayList<Assignment> grades = (ArrayList<Assignment>) gradesResponse.getBody();
        assertTrue(grades != null && grades.size() > 0);
    }   

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


    // TODO: Redo, this tests the scraper not the handler
    @Test 
    void testFindCourseById() {
        // Tests findCourseById
        var course = scraper.findByCourseId(REAL_COURSEID);
        assertTrue(course != null);
        assertTrue(scraper.findByCourseId("") == null);
        assertTrue(scraper.findByCourseId("123") == null);
    }

    // TODO: Redo, this tests the scraper not the handler
    @Test
    void testFindAssignmentById() {
        // Tests findCourseById
        var assignment = scraper.findByAssignmentId(REAL_ASSIGNMENTID);
        assertTrue(assignment != null);
        assertTrue(scraper.findByAssignmentId("") == null);
        assertTrue(scraper.findByAssignmentId("123") == null);
    }
}
