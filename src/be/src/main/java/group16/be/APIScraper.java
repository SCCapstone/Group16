package group16.be;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.mongodb.MongoClientException;

import group16.be.db.Assignment;
import group16.be.db.AssignmentRepository;
import group16.be.db.Course;
import group16.be.db.CourseRepository;
import group16.be.db.Grade;
import group16.be.db.GradeRepository;
import group16.be.db.User;
import group16.be.db.User.CourseId;
import group16.be.db.UserRepository;

@Component
public class APIScraper implements CommandLineRunner {
    @Autowired
    private UserRepository userRepo;

    @Autowired 
    private CourseRepository courseRepo;

    @Autowired
    private AssignmentRepository assignmentRepo;

    @Autowired
    private GradeRepository gradeRepo;
    
    @Override
    public void run(String... args) throws Exception {
        //createTestDocs();
        //findTestTwo();
        //login("osterholt", "cameron1234");
    }

    public String login(String username, String password) {
        ArrayList<User> users = userRepo.findByUserNameAndPassword(username, password);
        if (users.size() == 1) {
            return users.get(0).getId();
        }
        if(users.size() > 1) {
            return "Error: Multiple users with the same username and password";
        }
        return "Error: Invalid Credentials";
    }

    /**
     * This method is to get the user's courses
     * @param uID the user's ID
     * @return the user's ArrayList of courses
     */
    public ArrayList<Course> getCourses(String uID) {
        ArrayList<User> users = null;
        try{
            users = userRepo.findUserByUserId(uID);
        } catch (Exception e) {
            System.out.println("getCourses() Error: No user with that ID");
            e.printStackTrace();
            return null;
        }
        // ArrayList<User> users = userRepo.findByUserName(uID);
        // System.out.println("Debug: User is: " + users.get(0).toString());
        if (users.size() != 1) {
            System.out.println("Error: Multiple users with the same ID");
            return null; // not just one user by id
        }
        ArrayList<CourseId> courseIDs = users.get(0).getCourseIDs();
        // System.out.println("DEBUG: course ids: ");
        // for (CourseId courseID : courseIDs) {
        //     System.out.println("\tId: " + courseID.getCourseId());
        // }

        ArrayList<Course> courses = new ArrayList<Course>();
        for (CourseId courseID : courseIDs) {
            courses.add(courseRepo.findByCourseId(courseID.getCourseId()));
        }
        // System.out.println("DEBUG: course names: ");
        // for (Course course : courses) {
        //     System.out.println("\tName: " + course.getName());
        // }
        return courses;
    }
    
    /**
     * This method returns a course by courseId
     * @param courseId
     * @return
     */
    public Course findByCourseId(String courseId) {
        if(courseId == null || courseId.length() == 0) {
            System.out.println("Error: No assignment ID provided");
            return null;
        }
        try {
            return courseRepo.findByCourseId(courseId);
        } catch (Exception e) {
            System.out.println("Error: No assignment with that ID");
            e.printStackTrace();
            return null;
        }
    }

    /**
     * This method is to get the user's assignments
     * @param userId the user's ID
     * @return the user's ArrayList of assignments
     */
    public ArrayList<Assignment> getAssignments(String userId) {
        if(userId == null || userId.length() == 0) {
            System.out.println("Error: No user ID provided");
            return null;
        }
        //get the assignments for the course
        ArrayList<Assignment> assignments = null;
        try {
            assignments = assignmentRepo.findByUserId(userId);
        } catch (Exception e) {
            System.out.println("getAssignments() Error: No user with that ID");
            // e.printStackTrace();
            return null;
        }
        
        return assignments;
    }

    /**
     * THis method is to get the user's assignment by assignmentId
     * @param uID
     * @return
     */
    public Assignment findByAssignmentId(String aID) {
        if(aID == null || aID.length() == 0) {
            System.out.println("Error: No assignment ID provided");
            return null;
        }
        Assignment assignment = null;
        try{
            assignment = assignmentRepo.findByAssignmentId(aID);
        } catch (Exception e) {
            System.out.println("getAssignment() Error: No user with that ID");
            e.printStackTrace();
        }
        return assignment;
    }

    public User getUser(String uID) {
        if(uID == null || uID.length() == 0) {
            System.out.println("Error: No user ID provided");
            return null;
        }
        var user = userRepo.findById(uID);
        if(user.isEmpty() || user.get() == null) {
            System.out.println("Error: No user with that ID");
            return null;
        }
        return user.get();
    }

    public List<User> getAllUsers() {
        List<User> users = new ArrayList<User>();
        try{
            users = userRepo.findAll();
        } catch (Exception e) {
            System.out.println("getUsers() Error: No users found");
            e.printStackTrace();
            return null;
        }
        return users;
    }

    public ArrayList<Grade> getGrades(String userId) {
        var users = new ArrayList<User>();
        try{
            users = userRepo.findUserByUserId(userId);
        } catch (Exception e) {
            System.out.println("getCourses() Error: No user with that ID");
            e.printStackTrace();
            return null;
        }

        if(users.size() != 1) {
            System.out.println("Error: Multiple users with the same ID");
            return null; // not just one user by id
        }

        //get the grades for the user
        return gradeRepo.findByUserId(userId);
    }

    public Grade getGradeByGradeId(String gradeId) {
        if(gradeId == null || gradeId.length() == 0) {
            System.out.println("Error: No grade ID provided");
            return null;
        }
        var grade = gradeRepo.findById(gradeId);
        if(grade.isEmpty()) {
            System.out.println("Error: No grade with that ID");
            return null;
        }
        return grade.get();
    }

    public Grade getGradeByAssignmentId(String assignmentId) {
        if(assignmentId == null || assignmentId.length() == 0) {
            System.out.println("Error: No assignment ID provided");
            return null;
        }
        var grades = gradeRepo.findByAssignmentId(assignmentId);
        if(grades.size() != 1) {
            System.out.println("Error: Multiple grades with the same assignment ID");
            return null;
        }
        return grades.get(0);
    }

    public boolean saveUser(User user) {
        try {
            userRepo.save(user);
            return true;
        } catch(MongoClientException e) {
            e.printStackTrace();
            return false;
        } catch(Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean saveAssignment(Assignment assignment) {
        try {
            assignmentRepo.save(assignment);
            return true;
        } catch(MongoClientException e) {
            e.printStackTrace();
            return false;
        } catch(Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean deleteAssignment(Assignment assignment) {
        try {
            assignmentRepo.delete(assignment);
            return true;
        } catch(MongoClientException e) {
            e.printStackTrace();
            return false;
        } catch(Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean saveGrade(Grade grade) {
        try {
            gradeRepo.save(grade);
            return true;
        } catch(MongoClientException e) {
            e.printStackTrace();
            return false;
        } catch(Exception e) {
            e.printStackTrace();
            return false; 
        }
    }

    public boolean deleteGrade(Grade grade) {
        try {
            gradeRepo.delete(grade);
            return true;
        } catch(MongoClientException e) {
            e.printStackTrace();
            return false;
        } catch(Exception e) {
            e.printStackTrace();
            return false;
        }
    }


    public boolean isUserId(String userId) {
        if(userId == null || userId.length() == 0) 
            return false;
        return userRepo.existsById(userId);
    }

    public boolean isCourseId(String courseId) {
        if(courseId == null || courseId.length() == 0) 
            return false;
        return courseRepo.existsById(courseId);
    }

    public boolean isAssignmentId(String assignmentId) {
        if(assignmentId == null || assignmentId.length() == 0) 
            return false;
        return assignmentRepo.existsById(assignmentId);
    }

    public static File scrapeUser(String uID) {
        // calls a seperate thread that scrapes for each item in the queue
        //scrape the API and return the json file
        return null;
    }

    // private static void scrapeUpdates() {
    //     //scrape the API for updates at the interval
    // }

}
