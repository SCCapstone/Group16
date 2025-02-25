package group16.be;

import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class EmailControllerTest {
    @Autowired
    private APIScraper scraper;

    private final String REAL_USERID = "673fdd30cc2da4c3a3514fb7";
    private final String USER_EMAIL = "cam@osterholt.us";

    @Test
    public void testEmailController() {
        var user = scraper.getUser(REAL_USERID).get(0);
        try {
            EmailController.sendEmail(user);
            assertTrue(true);
        } catch (Exception e) {
            e.printStackTrace();
            assertTrue(false);
        }
    }
    
    @Test
    public void testGetEmail() {
        var email = scraper.getUser(REAL_USERID).get(0).getEmail();
        assertTrue(email.equals(USER_EMAIL));
    }
}