package group16.be;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class SendEmailTests {
    private final String REAL_USERID = "673fdd30cc2da4c3a3514fb7";

    @Autowired
    private APIScraper scraper;

    @Test
    void testSendEmail() {
        assertEquals(Environment.MAIL_STMP_PASSWORD, System.getenv("MAIL_STMP_PASSWORD"));
        assertEquals(Environment.MAIL_STMP_USERNAME, System.getenv("MAIL_STMP_USERNAME"));
        assertEquals(Environment.MAIL_STMP_HOST, System.getenv("MAIL_STMP_HOST"));
        assertEquals(Environment.MAIL_STMP_PORT, System.getenv("MAIL_STMP_PORT"));
        try {
            var user = scraper.getUser(REAL_USERID).get(0);
            EmailController.sendEmail(user);
            assert(true);
        } catch (Exception e) {
            e.printStackTrace();
            assert(false);
        }
        
    }
}
