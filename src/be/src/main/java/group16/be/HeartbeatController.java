package group16.be;

import java.sql.Time;

public class HeartbeatController {
    private Time interval;
    private static HeartbeatController heartbeatController;

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
        for (Connection connection : InstanceManager.getInstance().getConnections()) {
            if(!connection.isConnected())
                InstanceManager.getInstance().getConnections().remove(connection);
        }
    }
}
