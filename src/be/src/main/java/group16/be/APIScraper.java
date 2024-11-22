package group16.be;

import java.io.File;
import java.util.ArrayList;
import java.util.List; 

import group16.be.db.TestClass;
import group16.be.db.TestRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class APIScraper implements CommandLineRunner {
    
    @Autowired
    private TestRepository testItemRepo;
    
    @Override
    public void run(String... args) throws Exception {
        //createTestDocs();
        findTestTwo();
    }

    public String getItemDetails(TestClass item) {

        System.out.println(
        "ID: " + item.getId() + 
        ", \nItem Date: " + item.getCreationDate() + 
        ", \nItem Description: " + item.getDescription()
        );
        
        return "";
    }
    public void createTestDocs() {
        testItemRepo.save(new TestClass("Test 1"));
        testItemRepo.save(new TestClass("Test 2"));
        testItemRepo.save(new TestClass("Test 3"));

        List<TestClass> itemList = new ArrayList<TestClass>();
        itemList.forEach(this::getItemDetails);
    }

    public void findTestTwo() {
        List<TestClass> testTwo = testItemRepo.findByDescription("Test 2");
        testTwo.forEach(this::getItemDetails);
    }

    public static File scrapeUser(String uID) {
        // calls a seperate thread that scrapes for each item in the queue
        //scrape the API and return the json file
        return null;
    }

    private static void scrapeUpdates() {
        //scrape the API for updates at the interval
    }

}
