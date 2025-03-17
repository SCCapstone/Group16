package group16.be;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.ArrayList;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Async;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import group16.be.db.Assignment;
import group16.be.db.AssignmentRepository;
import group16.be.db.Grade;
import group16.be.db.User;

@SpringBootTest
public class ModifyDatabaseTests {
    private final String MOCK_USERID = "1234";
    private final String MOCK_COURSEID = "5678";
    private final String MOCK_ASSIGNMENTID = "91011";
    private final String MOCK_TITLE = "Title";
    private final String MOCK_TITLE2 = "Title2";
    private final String MOCK_DESCRIPTION = "Description";
    private final String MOCK_DESCRIPTION2 = "Description2";
    private final String MOCK_DUEDATE = "Due Date";
    private final String MOCK_DUEDATE2 = "Due Date2";
    private final String MOCK_USERNAME = "Username";
    private final String MOCK_PASSWORD = "Password";
    private final String MOCK_PASSWORD2 = "Password2";
    
    @MockitoBean
    private AssignmentRepository assignmentRepo;

    @MockitoBean
    private APIScraper scraper;

    @Autowired
    private RequestHandler requestHandler;
    
    @BeforeEach
    void setUp() {
        // Return true when saving a user
        Mockito.when(scraper.saveUser(Mockito.any(User.class))).thenReturn(true);
        Mockito.when(scraper.saveAssignment(Mockito.any(Assignment.class))).thenReturn(true);
        Mockito.when(scraper.saveGrade(Mockito.any(Grade.class))).thenReturn(true);
        
        // Return a specific assignment when getting assignments
        var assignments = new ArrayList<Assignment>();
        var assignment = new Assignment(MOCK_USERID, MOCK_COURSEID, MOCK_TITLE, MOCK_DESCRIPTION, MOCK_DUEDATE, true);
        assignments.add(assignment);
        Mockito.when(scraper.getAssignments(MOCK_USERID)).thenReturn(assignments);

        // Return a specific grade when getting grades
        var grades = new ArrayList<Grade>();
        var grade = new Grade(MOCK_USERID, MOCK_COURSEID, MOCK_ASSIGNMENTID, 100);
        grades.add(grade);
        Mockito.when(scraper.getGrades(MOCK_USERID)).thenReturn(grades);  

        Mockito.when(scraper.isUserId(MOCK_USERID)).thenReturn(true);
        Mockito.when(scraper.isCourseId(MOCK_COURSEID)).thenReturn(true);
        Mockito.when(scraper.isAssignmentId(MOCK_ASSIGNMENTID)).thenReturn(true);
    }

    @Test
    void testAddAssignment() {
        // Tests adding an assignment which does not exist.
        var response1 = requestHandler.addAssignmentWithoutId(MOCK_TITLE2, MOCK_DESCRIPTION2, MOCK_DUEDATE2, MOCK_USERID, MOCK_COURSEID);
        assertTrue(response1 != null);
        assertTrue(response1.getStatusCode() == HttpStatus.OK);
        assertTrue(response1.getBody() instanceof Assignment);
        // Tests adding an assignment which exists.
        var response = requestHandler.addAssignmentWithoutId(MOCK_TITLE, MOCK_DESCRIPTION, MOCK_DUEDATE, MOCK_USERID, MOCK_COURSEID);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Async
    @Test
    void testEditAssignment() {
        // Essentually, you make a fake assignment, declare a mockito return on getID to be the fake assignment, modify it and assert the new data is true.
        var assignment = new Assignment(MOCK_USERID, MOCK_COURSEID, MOCK_TITLE, MOCK_DESCRIPTION, MOCK_DUEDATE, true);
        Mockito.when(scraper.findByAssignmentId(MOCK_ASSIGNMENTID)).thenReturn(assignment);
        var response = requestHandler.editAssignment(MOCK_USERID, MOCK_COURSEID, MOCK_ASSIGNMENTID, MOCK_TITLE2, MOCK_DESCRIPTION2, MOCK_DUEDATE2);
        assertTrue(response != null && response.getStatusCode() == HttpStatus.OK);
        assignment = (Assignment) response.getBody();
        assertTrue(assignment != null);
        assertEquals(assignment.getTitle(), MOCK_TITLE2);
        assertEquals(assignment.getDescription(), MOCK_DESCRIPTION2);
        assertEquals(assignment.getDueDate(), MOCK_DUEDATE2);        
    }

    @Async
    @Test
    void testEditPassword() {
        // Change the password of the mock user.
        var user = new User(MOCK_USERID, MOCK_USERID, MOCK_PASSWORD);
        Mockito.when(scraper.getUser(MOCK_USERID)).thenReturn(user);

        var response = requestHandler.editPassword(MOCK_USERID, MOCK_PASSWORD, MOCK_PASSWORD2);
        assertEquals(response.getStatusCode(), HttpStatus.OK);
        user = (User) response.getBody();
        assertTrue(user != null);
        assertTrue(user.checkPassword(MOCK_PASSWORD2));
    }

    // @Test
    // void testSetGrades() {

    //     // Tests setting a grade which exists.
    //     ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
    //         requestHandler.setGrade(MOCK_USERID, MOCK_COURSEID, MOCK_ASSIGNMENTID, 100);
    //     });
    //     assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
    //     assertEquals(exception.getReason(), "Grade already exists");
    // }
}
