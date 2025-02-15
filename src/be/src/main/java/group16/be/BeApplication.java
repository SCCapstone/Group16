package group16.be;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableMongoRepositories(
	basePackages = "group16.be.db",
	queryLookupStrategy = org.springframework.data.repository.query.QueryLookupStrategy.Key.CREATE_IF_NOT_FOUND
)
public class BeApplication {

	public static void main(String[] args) {
		SpringApplication.run(BeApplication.class, args);
		ApplicationContext ctx = new AnnotationConfigApplicationContext(AppConfig.class);
		HeartbeatController heartbeatController = (HeartbeatController) ctx.getBean("heartbeatController");
		heartbeatController.start();
	}
}