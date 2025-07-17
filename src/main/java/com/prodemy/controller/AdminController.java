package com.prodemy.controller;

import com.prodemy.service.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.http.*;
import org.springframework.scheduling.config.Task;
import org.springframework.security.access.prepost.*;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")  // Spring Security annotation
public class AdminController {
    @PostMapping("/ban-user/{userId}")
    public ResponseEntity<?> banUser(@PathVariable int userId) {
        // Logic to ban a user
    }
}