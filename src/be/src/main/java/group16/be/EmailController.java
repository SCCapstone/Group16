package group16.be;

import java.util.Properties;

import group16.be.db.User;
import jakarta.mail.Authenticator;
import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.Multipart;
import jakarta.mail.PasswordAuthentication;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.AddressException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeBodyPart;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.MimeMultipart;

public class EmailController {
    
    public static void sendEmail(User user) throws AddressException, MessagingException {
        String username = System.getenv("MAIL_SMTP_USERNAME");
        String password = System.getenv("MAIL_SMTP_PASSWORD");
        String host = System.getenv("MAIL_SMTP_HOST");
        String port = System.getenv("MAIL_SMTP_PORT");
        
        Properties prop = new Properties();
        prop.put("mail.smtp.auth", true);
        prop.put("mail.smtp.starttls.enable", "true");
        prop.put("mail.smtp.host", host);
        prop.put("mail.smtp.port", port);
        prop.put("mail.smtp.ssl.trust", host);
        Session session = Session.getInstance(prop, new Authenticator() {

/**
 * Provides the username and password for email authentication.
 *
 * @return a PasswordAuthentication object containing the email username and password
 */

            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });


        Message message = new MimeMessage(session);
        message.setFrom(new InternetAddress("from@trial-zr6ke4nd9y9gon12.mlsender.net"));
        message.setRecipients(
            Message.RecipientType.TO, InternetAddress.parse(user.getEmail()));
        message.setSubject("Mail Subject");
        String msg = "This is my first email using JavaMailer";

        MimeBodyPart mimeBodyPart = new MimeBodyPart();
        mimeBodyPart.setContent(msg, "text/html; charset=utf-8");

        Multipart multipart = new MimeMultipart();
        multipart.addBodyPart(mimeBodyPart);

        message.setContent(multipart);

        Transport.send(message);
        
    }

    public static void sendEmail(String emailAddress, String message) throws AddressException, MessagingException {
        throw new UnsupportedOperationException("Not supported yet.");   
    }
}
