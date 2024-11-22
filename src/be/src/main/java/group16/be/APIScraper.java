package group16.be;

import java.io.File;
import java.sql.Time;
import java.util.Queue;
import java.util.ArrayList;
import java.util.List; 

import org.bson.Document;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@EnableMongoRepositories
public class APIScraper {
    private Queue queue;
    private Time interval;
    private static APIScraper apiScraper;
    private MongoClient mongoClient;
    private final String connectionString = "mongodb+srv://camo:<db_password>@capstonecluster.265el.mongodb.net/?retryWrites=true&w=majority&appName=CapstoneCluster";

    private APIScraper() {
        interval = new Time(0); //TODO: determine interval
        connectToDB();
    }

    public static APIScraper getInstance() {
        if (apiScraper == null) {
            apiScraper = new APIScraper();
        }
        return apiScraper;
    }

    private void connectToDB() {
        //connect to Mongo db
        // String connectionString = System.getProperty("mongodb.uri");
        try (MongoClient mongoClient = MongoClients.create(connectionString)) {
            // connect to the database
            System.out.println("Connection successfully established");
            List<Document> databases = mongoClient.listDatabases().into(new ArrayList<>());
            databases.forEach(db -> System.out.println(db.toJson()));
        } catch (Exception e) {
            System.err.println(e);
        }
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
