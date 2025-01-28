package group16.be;

import java.sql.Time;
import java.util.List;

import group16.be.db.User;

public class HeartbeatController {
    private Time interval;
    private static HeartbeatController heartbeatController;
    public List<User> loggedInUsers;

    private HeartbeatController() {
        interval = new Time(0); //TODO: determine interval
    }

    public static HeartbeatController getInstance() {
        if (heartbeatController == null) {
            heartbeatController = new HeartbeatController();
        }
        return heartbeatController;
    }

    /**
     * This method is used to send heartbeats to all connected users
     */
    public static void sendHeartbeats() {
        // send heartbeats to all connected users
    }
}
