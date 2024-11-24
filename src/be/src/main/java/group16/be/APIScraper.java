package group16.be;

import java.io.File;
import java.util.List; 

import group16.be.db.User;
import group16.be.db.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class APIScraper implements CommandLineRunner {
    @Autowired
    private UserRepository userRepo;
    
    @Override
    public void run(String... args) throws Exception {
        //createTestDocs();
        //findTestTwo();
        //login("osterholt", "cameron1234");
    }

    public String login(String username, String password) {
        List<User> users = userRepo.findByUserNameAndPassword(username, password);
        
        //TODO: Need to decide how to handle these errors.
        if (users.size() == 1) {
            return users.get(0).getId();
        }
        if(users.size() > 1) {
            return "Error: Multiple users with the same username and password";
        }
        return "Error: No user with that username and password";
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
