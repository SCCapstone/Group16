package com.group16.be;
import java.util.ArrayList;

public class InstanceManager {
    private InstanceManager instanceManager;
    private ArrayList<Connection> connections;

    public InstanceManager getInstanceManager() {
        if (instanceManager == null) {
            instanceManager = new InstanceManager();
        }
        return instanceManager;
    }

    private InstanceManager() {
        connections = new ArrayList<Connection>();
    }
}
