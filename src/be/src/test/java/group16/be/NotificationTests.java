package group16.be;

import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.integration.leader.event.OnGrantedEvent;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

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

	@MockitoBean
	private EmailController emailController;

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
		Mockito.doNothing().when(emailController).sendEmail(Mockito.any(String.class), Mockito.any(String.class), Mockito.any(String.class));
		
		var user = scraper.getUser(REAL_USERID);
		assertTrue(user.getNotifications() != null);
		assertTrue(user.getNotifications().size() == 0);

		notificationManager.sendNotification(user, "Test Notification 1");

		assertTrue(user.getNotifications().size() > 0);
		System.out.println("Notification: " + user.getNotifications().peek());
	}

	@Test
	void listenerTests() throws InterruptedException {
		Mockito.doNothing().when(emailController).sendEmail(Mockito.any(String.class), Mockito.any(String.class), Mockito.any(String.class));
		
		assertTrue(scraper.getUser(REAL_USERID).getNotifications().size() == 0);

		// Start the change listener
		mongoChangeListener.onLeadershipGranted(new OnGrantedEvent(new Object(), null, "testRole"));

		// Wait for the listener to start
		waitForListener();
		Thread.sleep(1000);

		// I am going to modify a grade of "osterholt" in the database. This should update the notifications.
		var user = scraper.getUser(REAL_USERID);

		var grade = scraper.getGradeByGradeId(REAL_GRADEID);
		grade.setPercent(91);
		scraper.saveGrade(grade);
		grade.setPercent(90);
		scraper.saveGrade(grade);

		Thread.sleep(1000);

		user = scraper.getUser(REAL_USERID);
		System.out.println("DEBUG: User: " + user.simpleToString());
	
		System.out.println("Notification: " + user.getNotifications().peek());
		assertTrue(user.getNotifications().size() > 0);
	}
	@Test
	void sendDueSoonNotification() {
		notificationManager.notifyDueSoonAssignments();
	}

	private void waitForListener() throws InterruptedException {
		int retries = 10;
		while (retries > 0) {
			if (mongoChangeListener.isRunning()) {
				return;
			}
			Thread.sleep(1000);
			retries--;
		}
		throw new IllegalStateException("MongoChangeListener did not start in time.");
	}
}