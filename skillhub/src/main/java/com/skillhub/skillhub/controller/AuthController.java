package com.skillhub.skillhub.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import java.util.Map;
import java.util.Collections;
import java.util.Optional;
import java.util.HashMap;
import org.springframework.http.HttpStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.skillhub.skillhub.model.User;
import com.skillhub.skillhub.repository.UserRepository;
import com.skillhub.skillhub.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/status")
    public ResponseEntity<?> getAuthStatus(HttpSession session) {
        return ResponseEntity.ok(authService.getAuthStatus(session));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        String name = credentials.get("name");
        
        if (email == null || password == null || name == null) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Email, password, and name are required"
            ));
        }
        
        return ResponseEntity.ok(authService.register(email, password, name));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials, HttpSession session) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        
        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Email and password are required"
            ));
        }
        
        return ResponseEntity.ok(authService.login(email, password, session));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        authService.logout(session);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleAuth(@RequestBody Map<String, String> payload, HttpSession session) {
        try {
            String credential = payload.get("credential");
            if (credential == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "No credential provided"
                ));
            }

            // Verify the Google token and get user info
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                new NetHttpTransport(),
                new GsonFactory()
            )
            .setAudience(Collections.singletonList("235074436580-fekrpapo667arbo0jkqa9nmprcpqul96.apps.googleusercontent.com"))
            .build();

            GoogleIdToken idToken = verifier.verify(credential);
            if (idToken == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Invalid ID token"
                ));
            }

            Payload tokenPayload = idToken.getPayload();
            String email = tokenPayload.getEmail();
            String name = (String) tokenPayload.get("name");
            String picture = (String) tokenPayload.get("picture");

            // Check if user exists
            Optional<User> existingUser = userRepository.findByEmail(email);
            User user;

            if (existingUser.isPresent()) {
                user = existingUser.get();
            } else {
                // Create new user
                user = new User();
                user.setEmail(email);
                user.setName(name);
                user.setPassword(""); // No password for Google users
                user.setRole("USER");
                user = userRepository.save(user);
            }

            // Create session
            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("id", user.getId());
            userInfo.put("email", user.getEmail());
            userInfo.put("name", user.getName());
            userInfo.put("role", user.getRole());
            userInfo.put("picture", picture);
            
            session.setAttribute("user", userInfo);

            return ResponseEntity.ok(Map.of(
                "success", true,
                "user", userInfo
            ));

        } catch (Exception e) {
            logger.error("Google authentication failed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "success", false,
                    "message", "Authentication failed"
                ));
        }
    }
} 