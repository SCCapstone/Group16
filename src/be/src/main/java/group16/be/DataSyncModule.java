package group16.be;

import group16.be.db.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    public void cleanInvalidDatabaseEntries() {
        for (User user : userRepo.findAll()) {
            if (user.getId() == null || user.getId().trim().isEmpty()) {
                userRepo.delete(user);
            }
        }

        for (Course course : courseRepo.findAll()) {
            if (course.getId() == null || course.getId().trim().isEmpty()) {
                courseRepo.delete(course);
            }
        }

        for (Assignment assignment : assignmentRepo.findAll()) {
            if (assignment.getId() == null || assignment.getId().trim().isEmpty()) {
                assignmentRepo.delete(assignment);
            }
        }

        for (Grade grade : gradeRepo.findAll()) {
            boolean invalidId = grade.getId() == null || grade.getId().trim().isEmpty();
            boolean negativeScore = grade.getPercent() < -1;

            if (invalidId || negativeScore) {
                gradeRepo.delete(grade);
            }
        }
    }
}
