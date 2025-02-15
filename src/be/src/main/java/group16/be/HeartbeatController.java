package group16.be;

import java.util.concurrent.ConcurrentHashMap;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;


@Component
@Scope("prototype")
public class HeartbeatController extends Thread {
    public ConcurrentHashMap<String, Boolean> loggedInUsers;

    private HeartbeatController() {
        loggedInUsers = new ConcurrentHashMap<>();
    }

    public void run(String... args) {
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


}
