package group16.be;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;

import jakarta.annotation.PostConstruct;

@Service
public class MongoChangeListener {
    private final String MONGO_URI = System.getenv("MONGO_URI");
    private final String[] COLLECTIONS = { "assignments", "courses", "users", "grades" };

    private MongoClient mongoClient;

    @Autowired
    private NotificationManager notificationManager;

    // TODO: Change COLLECTIONS from static reference.
    // TODO: Send to NotificationManager.
    @PostConstruct
    public void init() {
        mongoClient = MongoClients.create(MONGO_URI);
        new Thread(() -> watchCollection(COLLECTIONS[0])).start(); // assignments
        new Thread(() -> watchCollection(COLLECTIONS[1])).start(); // courses
        new Thread(() -> watchCollection(COLLECTIONS[2])).start(); // users
        new Thread(() -> watchCollection(COLLECTIONS[3])).start(); // grades
    }

    private void watchCollection(String collectionName) {
        MongoCollection<Document> collection = getCollection(collectionName);
        
        var changeStream = collection.watch().iterator();
        while (changeStream.hasNext()) {
            var change = changeStream.next();
            // System.out.println("DEBUG: MONGO CHANGE" + change);
            notificationManager.parseChange(change);
        }
    }

    public MongoCollection<Document> getCollection(String collectionName) {
        var db = mongoClient.getDatabase("bb_data");
        return db.getCollection(collectionName);
    }
}
