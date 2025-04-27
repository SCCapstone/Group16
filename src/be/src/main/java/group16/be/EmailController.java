package group16.be;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailController {
    @Value("${spring.mail.username}")
    private String from;

    @Autowired
    private JavaMailSender mailSender;

    private HashMap<String, String> CARRIERS  = new HashMap<String, String>() {{
        put("AT&T", "value1");
        put("T-Mobile", "value2");
        put("Verizon", "value2");
    }};

    /**
     * Sends an email to the specified recipient with the given subject and body.
     *
     * @param to      the recipient's email address
     * @param subject the subject of the email
     * @param body    the body of the email
     */
    public void sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        message.setFrom(from);    

        mailSender.send(message);
    }

    /**
     * Sends a text message to the specified recipient with the given subject and body.
     *
     * @param userId    the recipient's userId
     * @param subject   the subject of the text message
     * @param body      the body of the text message
     */
    public void sendTextMessage(String carrier, String subject, String body) {
        String carrierEmail = CARRIERS.get(carrier);
        sendEmail(carrierEmail, subject, body);
    }
}