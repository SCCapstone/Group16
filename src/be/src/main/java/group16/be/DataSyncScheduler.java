package group16.be;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class DataSyncScheduler {

    @Autowired
    private DataSyncModule dataSyncModule;

    @Scheduled(fixedRate = 3600000) // Every hour
    public void scheduledValidation() {
        dataSyncModule.cleanInvalidDatabaseEntries();
    }
}
