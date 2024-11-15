/*
 * LoginManager.java
 * This class is used to manage the login and registration of users
 * 
 * Author: Team 16
 * Date: November 2024
 * Team member(s): Cam Osterholt
 */

package group16.be;

public class LoginManager {
    private static LoginManager loginManager;

    public static LoginManager getInstance() {
        if (loginManager == null) {
            loginManager = new LoginManager();
        }
        return loginManager;
    }

    private LoginManager() {}

    public static String login(String username, String password) {
        // pass the username and password to the database to check if the user exists
        return null;
    }

    public static String register(String username, String password) {
        // pass the username and password to the database to check if the user exists
        // register user
        return null;
    }
}
