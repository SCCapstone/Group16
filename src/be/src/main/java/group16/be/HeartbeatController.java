package group16.be;

import java.util.concurrent.ConcurrentHashMap;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

public class HeartbeatController extends Thread {
    private static HeartbeatController heartbeatController;
    public static ConcurrentHashMap<String, Boolean> loggedInUsers;

    private HeartbeatController() {
        loggedInUsers = new ConcurrentHashMap<>();
    }

    public void run() {
        if (!loggedInUsers.isEmpty()) {
            while (true) {
                for (ConcurrentHashMap.Entry<String, Boolean> entry : loggedInUsers.entrySet()) {
                    if (!entry.getValue()) {
                        loggedInUsers.remove(entry.getKey());
                    } else {
                        entry.setValue(false);
                    } 
                }
                try {
                    sleep(30000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    // not sure if this still needs to be a singleton
    public static HeartbeatController getInstance() {
        if (heartbeatController == null) {
            heartbeatController = new HeartbeatController();
        }
        return heartbeatController;
    }

    @CrossOrigin
    @PostMapping("/api/heartbeat")
    public static boolean addAssignment(@RequestParam(value = "id", defaultValue = "NULL") String id) {
        if (id == null || id.equals("NULL")) {
            return false;
        }
        loggedInUsers.put(id, true);
        return true;
    }

}
