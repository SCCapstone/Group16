package group16.be;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.AddressException;

@SpringBootApplication
@EnableMongoRepositories(
	basePackages = "group16.be.db"
)
public class BeApplication {

	public static void main(String[] args) throws AddressException, MessagingException {
		ApplicationContext ctx = SpringApplication.run(BeApplication.class, args);
		
		HeartbeatController heartbeatController = (HeartbeatController) ctx.getBean("heartbeatController");
		heartbeatController.start();
	}
}