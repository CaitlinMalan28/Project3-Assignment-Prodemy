package com.prodemy.controller;

import com.prodemy.model.Quiz;
import com.prodemy.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*") // Allow frontend to call backend from localhost
@RequestMapping("/quizzes") // Matches frontend's URLs like /quizzes/create and /quizzes/all
public class QuizController {

    private final QuizService quizService;

    @Autowired
    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    // POST http://localhost:8080/quizzes/create
    @PostMapping("/create")
    public ResponseEntity<Quiz> create(@RequestBody Quiz quizInput) {
        try {
            Quiz newQuiz = quizService.createQuiz(quizInput);
            return ResponseEntity.ok(newQuiz);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // GET http://localhost:8080/quizzes/all
    @GetMapping("/all")
    public ResponseEntity<List<Quiz>> getAll() {
        try {
            List<Quiz> quizzes = quizService.getAllQuizzes();
            return ResponseEntity.ok(quizzes);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // GET http://localhost:8080/quizzes/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Quiz> getQuizById(@PathVariable Long id) {
        Quiz quiz = quizService.getQuizById(id);
        if (quiz != null) {
            return ResponseEntity.ok(quiz);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE http://localhost:8080/quizzes/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuiz(@PathVariable Long id) {
        boolean deleted = quizService.deleteQuiz(id);
        return deleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }
}
