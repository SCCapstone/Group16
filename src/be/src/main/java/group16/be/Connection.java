package group16.be;

import org.springframework.beans.factory.annotation.Autowired;

public class Connection {

    @Autowired
    private APIScraper scraper;

    private boolean connected;
    private String userId;

    public Connection() {
        connected = false;
    }
    
    public Connection(String uID) {
        userId = uID;
        connected = true;
    }

    public boolean isConnected() {
        return connected;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        var user = scraper.getUser(userId);
        if(user != null && user.size() == 1 && user.get(0).getId().equals(userId)) {
            this.connected = true;
            this.userId = userId;
        }
        else
            this.userId = null;
    }
}
