package group16.be;

import java.util.concurrent.atomic.AtomicBoolean;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.integration.leader.event.OnGrantedEvent;
import org.springframework.integration.leader.event.OnRevokedEvent;
import org.springframework.stereotype.Service;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;

import jakarta.annotation.PreDestroy;

@Service
public class MongoChangeListener {
    private final String MONGO_URI = System.getenv("MONGO_URI");
    private final String[] COLLECTIONS = { "assignments", "courses", "users", "grades" };
    private MongoClient mongoClient;
    private Thread[] threads = new Thread[COLLECTIONS.length];
    private final AtomicBoolean isRunning = new AtomicBoolean(false);

    @Autowired
    private NotificationManager notificationManager;
    
    @EventListener
    public void onLeadershipGranted(OnGrantedEvent event) {
        if (isRunning.compareAndSet(false, true)) {
            startListeners();
        }
    }

    @EventListener
    public void onLeadershipRevoked(OnRevokedEvent event) {
        if (isRunning.compareAndSet(true, false)) {
            stopListeners();
        }
    }
    
    private void startListeners() {
        if(mongoClient != null) {
            mongoClient.close();
        }
        mongoClient = MongoClients.create(MONGO_URI);
        System.out.println("DEBUG: MongoChangeListener started " + mongoClient.toString());
        for (int i = 0; i < COLLECTIONS.length; i++) {
            var collection = COLLECTIONS[i];
            threads[i] = new Thread(() -> watchCollection(collection));
            threads[i].start();
        }
    }

    private void stopListeners() {
        isRunning.set(false);
        if (threads != null) {
            for (Thread thread : threads) {
                if (thread != null) {
                    thread.interrupt();
                }
            }
        }
        if (mongoClient != null) {
            mongoClient.close();
            mongoClient = null;
        }
    }


    private void watchCollection(String collectionName) {
        MongoCollection<Document> collection = getCollection(collectionName);
        var changeStream = collection.watch();
        System.out.println("DEBUG: Watching collection " + collectionName);
        try (var iterator = changeStream.iterator()) {
            while (isRunning.get() && !Thread.currentThread().isInterrupted()) {
                System.out.println("DEBUG: Waiting for changes in collection " + collectionName);
                if (iterator.hasNext()) {
                    var change = iterator.next();
                    System.out.println("DEBUG: Change detected in collection " + collectionName + ": " + change.getFullDocument());
                    notificationManager.parseChange(change);
                }
            }
        } catch (Exception e) {
            System.err.println("Error in MongoDB change stream for collection " + collectionName + ": " + e.getMessage());
        }
    }

    public MongoCollection<Document> getCollection(String collectionName) {
        var db = mongoClient.getDatabase("bb_data");
        return db.getCollection(collectionName);
    }

    public boolean isRunning() {
		return isRunning.get();
	}

    @PreDestroy
    public void cleanup() {
        stopListeners();
    }

}
