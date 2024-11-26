package group16.be;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import group16.be.db.Course;
import group16.be.db.CourseRepository;
import group16.be.db.User;
import group16.be.db.UserRepository;
import group16.be.db.User.CourseId;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class APIScraper implements CommandLineRunner {
    @Autowired
    private UserRepository userRepo;

    @Autowired 
    private CourseRepository courseRepo;
    
    @Override
    public void run(String... args) throws Exception {
        //createTestDocs();
        //findTestTwo();
        //login("osterholt", "cameron1234");
    }

    public String login(String username, String password) {
        List<User> users = userRepo.findByUserNameAndPassword(username, password);
        
        //TODO: Need to decide how to handle these errors.
        if (users.size() == 1) {
            return users.get(0).getId();
        }
        if(users.size() > 1) {
            return "Error: Multiple users with the same username and password";
        }
        return "Error: No user with that username and password";
    }

    /**
     * This method is to get the user's courses
     * @param uID the user's ID
     * @return the user's list of courses
     */
    public List<Course> getCourses(String uID) {
        // List<User> users = userRepo.findUserByUserId(uID);
        List<User> users = userRepo.findByUserName(uID);
        System.out.println("Debug: User's name is: " + users.get(0).getName());
        if (users.size() != 1) {
            System.out.println("Error: Multiple users with the same ID");
            return null; // not just one user by id
        }
        List<CourseId> courseIDs = users.get(0).getCourseIDs();
        System.out.println("DEBUG: course ids: ");
        for (CourseId courseID : courseIDs) {
            System.out.println("\tId: " + courseID.getCourseId());
        }
        List<Course> courses = new ArrayList<Course>();
        for (CourseId courseID : courseIDs) {
            courses.add(courseRepo.findByCourseId(courseID.getCourseId())); //TODO: need to add the course to the list
        }
        System.out.println("DEBUG: course names: ");
        for (Course course : courses) {
            System.out.println("\tName: " + course.getName());
        }
        return courses;
    }

    public static File scrapeUser(String uID) {
        // calls a seperate thread that scrapes for each item in the queue
        //scrape the API and return the json file
        return null;
    }

    private static void scrapeUpdates() {
        //scrape the API for updates at the interval
    }

}
