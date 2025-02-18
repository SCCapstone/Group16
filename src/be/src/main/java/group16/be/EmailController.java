package group16.be;

import java.util.Properties;

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
    
    
    public static void sendEmail() throws AddressException, MessagingException {
        Properties prop = new Properties();
        prop.put("mail.smtp.auth", true);
        prop.put("mail.smtp.starttls.enable", "true");
        prop.put("mail.smtp.host", "smtp.mailersend.net");
        prop.put("mail.smtp.port", "587");
        prop.put("mail.smtp.ssl.trust", "smtp.mailersend.net");
        Session session = Session.getInstance(prop, new Authenticator() {

/**
 * Provides the username and password for email authentication.
 *
 * @return a PasswordAuthentication object containing the email username and password
 */

            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication("MS_VlGYll@trial-zr6ke4nd9y9gon12.mlsender.net", "mssp.uEACt7v.v69oxl5y10k4785k.edHBwr3");
            }
        });


        Message message = new MimeMessage(session);
        message.setFrom(new InternetAddress("from@trial-zr6ke4nd9y9gon12.mlsender.net"));
        message.setRecipients(
        Message.RecipientType.TO, InternetAddress.parse("scruggscayden@gmail.com"));
        message.setSubject("Mail Subject");

        String msg = "This is my first email using JavaMailer";

        MimeBodyPart mimeBodyPart = new MimeBodyPart();
        mimeBodyPart.setContent(msg, "text/html; charset=utf-8");

        Multipart multipart = new MimeMultipart();
        multipart.addBodyPart(mimeBodyPart);

        message.setContent(multipart);

        Transport.send(message);
        
    }
}
