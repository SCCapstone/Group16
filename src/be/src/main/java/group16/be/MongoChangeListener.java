package group16.be;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.integration.leader.event.OnGrantedEvent;
import org.springframework.integration.leader.event.OnRevokedEvent;
import org.springframework.stereotype.Service;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;

@Service
public class MongoChangeListener {
    private final String MONGO_URI = System.getenv("MONGO_URI");
    private final String[] COLLECTIONS = { "assignments", "courses", "users", "grades" };
    private MongoClient mongoClient;
    private Thread[] threads = new Thread[COLLECTIONS.length];
    private volatile boolean isLeader = false;

    @Autowired
    private NotificationManager notificationManager;

    @Autowired
    private LeaderElectionListener leaderElectionListener;
    
    @EventListener
    public void onLeadershipGranted(OnGrantedEvent event) {
        isLeader = true;
        startListeners();
    }

    @EventListener
    public void onLeadershipRevoked(OnRevokedEvent event) {
        isLeader = false;
        stopListeners();
    }
    
    private void startListeners() {
        mongoClient = MongoClients.create(MONGO_URI);
        for (int i = 0; i < COLLECTIONS.length; i++) {
            var collection = COLLECTIONS[i];
            threads[i] = new Thread(() -> watchCollection(collection));
            threads[i].start();
        }
    }

    private void stopListeners() {
        if(threads != null) {
            for (Thread thread : threads) {
                if (thread != null) {
                    thread.interrupt();
                }
            }
        }
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

    @PreDestroy
    public void cleanup() {
        stopListeners();
        mongoClient.close();
    }
}
