package group16.be;

import java.net.InetAddress;

public class Connection {
    private String uID;
    InetAddress ip;

    public Connection(String uID) {
        // determine if uID is valid
        this.uID = uID;
    }

    public boolean isConnected() {
        // check if the user is connected
        return false;
    }
}
