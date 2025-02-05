package group16.be;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.ArrayList;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import group16.be.db.Assignment;
import group16.be.db.AssignmentRepository;
import group16.be.db.Grade;
import group16.be.db.User;

@SpringBootTest
public class ModifyDatabaseTests {
    private final String MOCK_USERID = "1234";
    private final String MOCK_COURSEID = "5678";
    private final String MOCK_ASSIGNMENTID = "91011";
    private final String MOCK_GRADEID = "121314";
    private final String MOCK_TITLE = "Title";
    private final String MOCK_DESCRIPTION = "Description";
    private final String MOCK_DUEDATE = "Due Date";
    
    @MockBean
    private AssignmentRepository assignmentRepo;

    @MockBean
    private APIScraper scraper;

    @Autowired
    private RequestHandler requestHandler;
    
    @BeforeEach
    void setUp() {
        // Return true when saving a user
        Mockito.when(scraper.saveUser(Mockito.any(User.class))).thenReturn(true);
        
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

        // Tests adding an assignment which exists.
        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
            requestHandler.addAssignmentWithoutId(MOCK_TITLE, MOCK_DESCRIPTION, MOCK_DUEDATE, MOCK_USERID, MOCK_COURSEID);
        });
        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
        assertEquals(exception.getReason(), "Assignment already exists");
    }

    @Test
    void testSetGrades() {

        // Tests setting a grade which exists.
        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
            requestHandler.setGrade(MOCK_USERID, MOCK_COURSEID, MOCK_ASSIGNMENTID, 100);
        });
        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
        assertEquals(exception.getReason(), "Grade already exists");
    }
}
