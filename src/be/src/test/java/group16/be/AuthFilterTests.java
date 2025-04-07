package group16.be;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.cookie;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockCookie;
import org.springframework.test.web.servlet.MockMvc;

import jakarta.servlet.http.Cookie;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthFilterTests {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private TokenService tokenService;

    private final String REAL_USER_ID = "673fdd30cc2da4c3a3514fb7";
    private final String LOGIN_USER = "osterholt";
    private final String LOGIN_PASS = "cameron1234";

    @Test
    public void testValidAuthCookie() throws Exception {
        String token = tokenService.generateToken(REAL_USER_ID);
        MockCookie authCookie = new MockCookie("auth-token", token);
        authCookie.setHttpOnly(true);
        authCookie.setPath("/");

        mockMvc.perform(post("/api/login")
                .cookie(authCookie))
                .andExpect(status().isOk());
    }

    @Test
    public void testGetUserIdFromToken() {
        String token = tokenService.generateToken(REAL_USER_ID);
        String userId = tokenService.getAuthentication(token).getName();
        System.out.println("DEBUG: User ID from token: " + userId);
        assertEquals(REAL_USER_ID, userId);
    }

    @Test
    public void testRegularLogin() throws Exception {
        mockMvc.perform(post("/api/login")
                .param("username", LOGIN_USER)
                .param("password", LOGIN_PASS))
                .andExpect(status().isOk());
    }

    @Test
    public void testReLogin() throws Exception {
        mockMvc.perform(post("/api/login")
                .param("username", LOGIN_USER)
                .param("password", LOGIN_PASS))
                .andExpect(status().isOk())
                .andExpect(cookie().exists("auth-token")) // Assert that the auth-token cookie was created
                .andDo(result -> {
                    // Step 3: Capture the auth-token cookie from the response
                    Cookie authTokenCookie = result.getResponse().getCookie("auth-token");
                    assertNotNull(authTokenCookie);  // Make sure the cookie is present

                    // Step 4: Subsequent Request with the auth-token cookie
                    // Perform another request to test access with the cookie
                    mockMvc.perform(post("/api/login") // Same endpoint as the first request
                            .cookie(authTokenCookie)) // Attach the cookie to the request
                            .andExpect(status().isOk()); // This request should succeed since the cookie is valid
                });

        
    }
}
