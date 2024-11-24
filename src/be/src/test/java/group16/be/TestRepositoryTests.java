// package group16.be;

// import java.util.List;

// import org.junit.jupiter.api.Test;
// import org.junit.jupiter.api.Assertions;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.context.SpringBootTest;

// import group16.be.db.TestClass;
// import group16.be.db.TestRepository;

// @SpringBootTest
// public class TestRepositoryTests {
//     @Autowired
//     private TestRepository testRepository;

//     @Test
//     public void testFindByDescription() {
//         TestClass test = new TestClass("Sample");
//         testRepository.save(test);

//         List<TestClass> found = testRepository.findByDescription("Sample");
//         Assertions.assertEquals(1, found.size());
//     }
// }
