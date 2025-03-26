package group16.be;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class DataSyncScheduler {

    @Autowired
    private DataSyncModule dataSyncModule;

    @Scheduled(fixedRate = 3600000) // Every hour
    public void scheduledValidation() {
        List<String> errors = dataSyncModule.validateDatabase();
        if (!errors.isEmpty()) {
            System.out.println("Scheduled Data Validation Errors:");
            for (String error : errors) {
                System.out.println(error);
            }
        } else {
            System.out.println("Scheduled data validation passed. No issues found.");
        }
    }
}
