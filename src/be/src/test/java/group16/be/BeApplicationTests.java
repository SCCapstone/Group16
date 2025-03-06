package group16.be;

import static org.junit.jupiter.api.Assertions.assertTrue;

import org.bson.Document;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.mongodb.client.MongoCollection;

import group16.be.db.GradeRepository;

@SpringBootTest(classes = BeApplication.class)
public class BeApplicationTests {
	@Test
	void contextLoads() {
		
	}
}
