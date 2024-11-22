package group16.be;

import java.io.File;
import java.sql.Time;
import java.util.Queue;
import java.util.ArrayList;
import java.util.List; 

import org.bson.Document;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;

import group16.be.db.Test;
import group16.be.db.TestRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.stereotype.Component;

@Component
public class APIScraper implements CommandLineRunner {
    
    @Autowired
    private TestRepository testItemRepo;
    
    @Override
    public void run(String... args) throws Exception {
        createTestDocs();
    }

    // private void showAllGroceryItems() {
		 
    //     itemList = testItemRepo.findAll();
        
    //     itemList.forEach(item -> System.out.println(getItemDetails(item)));
    // }

    public String getItemDetails(Test item) {

        System.out.println(
        "ID: " + item.getId() + 
        ", \nItem Date: " + item.getCreationDate() + 
        ", \nItem Description: " + item.getDescription()
        );
        
        return "";
    }
    public void createTestDocs() {
        testItemRepo.save(new Test("Test 1"));
        testItemRepo.save(new Test("Test 2"));
        testItemRepo.save(new Test("Test 3"));

        List<Test> itemList = new ArrayList<Test>();
        itemList.forEach(this::getItemDetails);
    }

    // private void connectToDB() {
    //     //connect to Mongo db
    //     // String connectionString = System.getProperty("mongodb.uri");
    //     try (MongoClient mongoClient = MongoClients.create(connectionString)) {
    //         // connect to the database
    //         System.out.println("Connection successfully established");
    //         List<Document> databases = mongoClient.listDatabases().into(new ArrayList<>());
    //         databases.forEach(db -> System.out.println(db.toJson()));
    //     } catch (Exception e) {
    //         System.err.println(e);
    //     }
    // }

    public static File scrapeUser(String uID) {
        // calls a seperate thread that scrapes for each item in the queue
        //scrape the API and return the json file
        return null;
    }

    private static void scrapeUpdates() {
        //scrape the API for updates at the interval
    }

}
