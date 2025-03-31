package group16.be;

import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class NotificationTests {
    // private final String MONGO_URI = System.getenv("MONGO_URI");
    // private final String[] COLLECTIONS = { "assignments", "courses", "users", "grades" };

	/* Listener Test Variables */
	private final String REAL_USERID = "673fdd30cc2da4c3a3514fb7";
	private final String REAL_GRADEID = "679d3e875a709c3bbfdb83a3";

	@Autowired
	private APIScraper scraper;

	@Autowired
	private MongoChangeListener mongoChangeListener;

	@Autowired
	private NotificationManager notificationManager;

	@BeforeEach
	void clearNotifications() {
		var user = scraper.getUser(REAL_USERID);
		if (user.getNotifications() != null) {
			user.clearNotifications();
		}
		scraper.saveUser(user);
	}
    
    @Test
	void testNotifications() {
		var user = scraper.getUser(REAL_USERID);
		assertTrue(user.getNotifications() != null);
		assertTrue(user.getNotifications().size() == 0);

		notificationManager.sendNotification(user, "Test Notification 1");

		assertTrue(user.getNotifications().size() > 0);
		System.out.println("Notification: " + user.getNotifications().peek());
	}

	@Test
	void listenerTests() throws InterruptedException {
		assertTrue(scraper.getUser(REAL_USERID).getNotifications().size() == 0);
		mongoChangeListener.init();

		// I am going to modify a grade of "osterholt" in the database. This should update the notifications.
		var user = scraper.getUser(REAL_USERID);

		var grade = scraper.getGradeByGradeId(REAL_GRADEID);
		grade.setPercent(91);
		scraper.saveGrade(grade);
		grade.setPercent(90);
		scraper.saveGrade(grade);		

		Thread.sleep(500);
		user = scraper.getUser(REAL_USERID);
	
		assertTrue(user.getNotifications().size() > 0);
		System.out.println("Notification: " + user.getNotifications().peek());

		notificationManager.clearNotifications(REAL_USERID);
	}

}