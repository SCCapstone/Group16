package group16.be;

import group16.be.db.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class DataSyncModule {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private CourseRepository courseRepo;

    @Autowired
    private AssignmentRepository assignmentRepo;

    @Autowired
    private GradeRepository gradeRepo;

    public List<String> validateDatabase() {
        List<String> errors = new ArrayList<>();

        for (User user : userRepo.findAll()) {
            if (user.getId() == null || user.getId().trim().isEmpty()) {
                errors.add("User has a missing or empty ID: " + user);
            }
        }

        for (Course course : courseRepo.findAll()) {
            if (course.getId() == null || course.getId().trim().isEmpty()) {
                errors.add("Course has a missing or empty Course ID: " + course);
            }
        }

        for (Assignment assignment : assignmentRepo.findAll()) {
            if (assignment.getId() == null || assignment.getId().trim().isEmpty()) {
                errors.add("Assignment has a missing or empty ID: " + assignment);
            }
        }

        for (Grade grade : gradeRepo.findAll()) {
            if (grade.getId() == null || grade.getId().trim().isEmpty()) {
                errors.add("Grade has a missing or empty ID: " + grade);
            }
            if (grade.getPercent() < -1) {
                errors.add("Grade has a negative score: " + grade.getPercent() + " (Grade ID: " + grade.getPercent() + ")");
            }
        }

        return errors;
    }
}
