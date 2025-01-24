package group16.be;

import java.util.*;
import javax.mail.*;
import javax.mail.internet.*;
import javax.activation.*;
import javax.mail.Session;
import javax.mail.Transport;

public class SendMailExample {
    public static void main(String[] args) {
        // Recipient's email ID needs to be mentioned.
        String to = "camoster2020@gmail.com";
        
        String from = "cam@osterholt.us";

        String localhost = "127.0.0.1";

        Properties properties = System.getProperties();

        properties.setProperty("mail.smtp.host", localhost);

        Session session = Session.getDefaultInstance(properties);

        try {
            MimeMessage message = new MimeMessage(session);
            message.setFrom(new InternetAddress(from));
            message.addRecipient(Message.RecipientType.TO, new InternetAddress(to));
            int index = 1;
            message.setSubject("DEBUG: SendMailExample Test Email " + index);
            message.setText("This is a test email from SendMailExample.java");
            Transport.send(message);
            System.out.println("Sent message successfully....");
        } catch (MessagingException mex) {
            mex.printStackTrace(); 
        }
    }
}