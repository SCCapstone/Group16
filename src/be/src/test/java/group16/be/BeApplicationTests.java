package group16.be;

import java.util.ArrayList;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import group16.be.db.Course;
import group16.be.db.CourseRepository;
import group16.be.db.User;

@SpringBootTest(classes = BeApplication.class)
public class BeApplicationTests {

	@Autowired
	private APIScraper scraper;

	@Autowired 
	private CourseRepository courseRepo;

	@Test
	void contextLoads() {

	}

	/****  Do Not Delete/Uncomment the tests below  ****/

	// @Test
	// void makeNewUser() {
	// 	User copyFrom = scraper.getUser("673fdd30cc2da4c3a3514fb7");
	// 	String userName = "";
	// 	String password = "";
	// 	String studentId = "";
	// 	String email = "";
	// 	String universityEmail = "";
	// 	String mobilePhone = "";
	// 	String givenName = "";
	// 	String familyName = "";
	// 	String preferredDisplayName = "";
	// 	User user = new User(copyFrom, userName, password, studentId, email, universityEmail, mobilePhone, givenName, familyName, preferredDisplayName);
	// 	assert(scraper.saveUser(user));
	// }

	// @Test
	// void makeNewCourse() {
	// 	var courses = scraper.getCourses("673fdd30cc2da4c3a3514fb7");
	// 	var copyFrom = courses.get(0);
	// 	var user = scraper.getUser(scraper.login("admin", "admin"));
		
	// 	new Course(copyFrom, "name", "description", "termId");
		
	// 	for(var course : courses) {
	// 		user.addCourseId(course.getId());
	// 	}
	// 	assert(scraper.saveUser(user));
		

	// }

}
