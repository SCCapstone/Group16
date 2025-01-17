package group16.be;

import java.util.ArrayList;

public class InstanceManager {
    private static InstanceManager instanceManager;
    private static ArrayList<Connection> connections;

    public static InstanceManager getInstance() {
        if (instanceManager == null) {
            instanceManager = new InstanceManager();
        }
        return instanceManager;
    }

    private InstanceManager() {
        connections = new ArrayList<Connection>();
    }

    /**
     * This method is to connect a user to the server
     * @param uID User ID
     * @return if the user was successfully connected
     */
    public static boolean connect(String uID) {
        Connection connection = new Connection(uID);
        connections.add(connection);
        return true;
    }

    public static ArrayList<Connection> getConnections() {
        for (Connection connection : connections) {
            if(!connection.connected)
                connections.remove(connection);
        }
        return connections;
    }

}
