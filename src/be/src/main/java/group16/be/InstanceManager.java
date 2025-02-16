package group16.be;

import java.util.ArrayList;

import group16.be.db.User;

public class InstanceManager {
    private static InstanceManager instanceManager;
    private static ArrayList<Connection> connections;
    private static ArrayList<User> loggedInUsers;

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

    public static void addUser(User user) {
        loggedInUsers.add(user);
    }

    public static ArrayList<User> getLoggedInUsers() {
        return loggedInUsers;
    }

}
