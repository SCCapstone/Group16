package group16.be.db;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "grades")
public class Grade {
    private String id;
    public String getId() {
        return id;
    }
    private String uuid;
    private String courseId;
    public String getCourseId() {
        return courseId;
    }
    private String assignmentId;
    public String getAssignmentId() {
        return assignmentId;
    }
    private String userId;
    public String getUserId() {
        return userId;
    }
    private double percent;
    public double getPercent() {
        return percent;
    }
    
    public String getGradeChar() {
        if (percent >= 90) 
            return "A";
        else if (percent >= 86)
            return "B+";
        else if (percent >= 80) 
            return "B";
        else if (percent >= 76)
            return "C+";
        else if (percent >= 70) 
            return "C";
        else if (percent >= 66)
            return "D+";
        else if (percent >= 60) 
            return "D";
        else 
            return "F";
    }
}
