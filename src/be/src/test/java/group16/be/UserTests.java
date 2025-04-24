package group16.be;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.scheduling.annotation.Async;

import group16.be.db.User;

@SpringBootTest
public class UserTests {
    private final String[] VALID_PHONE_NUMBERS = {
            "1234567890", // Valid
            "123-456-7890", // Valid
            "(123) 456-7890", // Valid
            "+1 (123) 456-7890" // Valid
    };
    private final String[] INVALID_PHONE_NUMBERS = {
            "123456789", // Invalid
            "12345678901", // Invalid
            "123-45-6789", // Invalid
            "(123) 456-789", // Invalid
            "+1 (123) 456-78901", // Invalid
            "123.456.789", // Invalid
            "1234567890abc", // Invalid
            "abc1234567" // Invalid
    };

    @Async
    @Test
    void testSetPhoneNumber() {
        User user = new User();
        for (String phoneNumber : VALID_PHONE_NUMBERS) {
            assertTrue(user.setMobilePhone(phoneNumber));
        }
        for (String phoneNumber : INVALID_PHONE_NUMBERS) {
            assertFalse(user.setMobilePhone(phoneNumber));
        }
    }
}
