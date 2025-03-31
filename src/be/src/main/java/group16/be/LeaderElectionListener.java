package group16.be;

import org.springframework.context.event.EventListener;
import org.springframework.integration.leader.event.OnGrantedEvent;
import org.springframework.integration.leader.event.OnRevokedEvent;
import org.springframework.stereotype.Component;

@Component
public class LeaderElectionListener {
    private volatile boolean isLeader = false;

    @EventListener
    public void handleLeadershipGranted(OnGrantedEvent event) {
        isLeader = true;
        // Start db Monitoring
    }

    @EventListener
    public void handleLeadershipRevoked(OnRevokedEvent event) {
        isLeader = false;
        // Stop db Monitoring
    }

    public boolean isLeader() {
        return isLeader;
    }
}
