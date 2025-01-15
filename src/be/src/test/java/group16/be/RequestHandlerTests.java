package group16.be;

import java.util.HashMap;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import group16.be.db.UserRepository;

@SpringBootTest
public class RequestHandlerTests {
    @Autowired
    private RequestHandler handler;

    @Autowired
    private APIScraper scraper; // Needed for dependancies of autowired classes

    @MockBean
    private UserRepository userRepo;

    private final String LOGIN_USER = "osterholt";
    private final String LOGIN_PASS = "cameron1234";
    private final String EXPECTED_ID = "673fdd30cc2da4c3a3514fb7";
    private final Map<String, String> EXPECTED_RESPONSE = new HashMap<String, String>() {{
        put("id", "673fdd30cc2da4c3a3514fb7");
    }};

    @Test
    void testLogin() {
        Map response = handler.loginLogic(LOGIN_USER, LOGIN_PASS);
        assert(response.get("status").equals("success") 
            && response.entrySet().equals(EXPECTED_RESPONSE.entrySet()));
    }

    @Test
    void testLoginScraper() {
        String response = scraper.login("osterholt", "cameron1234");
        System.out.println("testLoginScraper() DEBUG: " + response);
        assert(response.equals(EXPECTED_ID));
    }
}
