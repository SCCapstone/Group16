package group16.be;

import java.io.File;
import java.sql.Time;
import java.util.Queue;

public class APIScraper {
    private Queue queue;
    private Time interval;
    private static APIScraper apiScraper;

    private APIScraper() {
        interval = new Time(0); //TODO: determine interval
    }

    public static APIScraper getInstance() {
        if (apiScraper == null) {
            apiScraper = new APIScraper();
        }
        return apiScraper;
    }

    public static File scrapeUser(String uID) {
        // calls a seperate thread that scrapes for each item in the queue
        //scrape the API and return the json file
        return null;
    }

    private static void scrapeUpdates() {
        //scrape the API for updates at the interval
    }

}
