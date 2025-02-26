package group16.be;

import java.util.ArrayList;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import group16.be.db.Course;
import group16.be.db.User;

@SpringBootTest(classes = BeApplication.class)
public class BeApplicationTests {

	@Test
	void contextLoads() {

	}

	@Test
	void makeNewUser() {
		User user = new User();
		// user.setUserName("admin");
		// user.setPassword("admin");

		ArrayList<Course> courses = new ArrayList<Course>();
		
		
	}

}
