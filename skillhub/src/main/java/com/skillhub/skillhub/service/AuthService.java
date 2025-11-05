package com.skillhub.skillhub.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.skillhub.skillhub.model.User;
import com.skillhub.skillhub.repository.UserRepository;

import jakarta.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public Map<String, Object> getAuthStatus(HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        Object user = session.getAttribute("user");
        
        response.put("authenticated", user != null);
        if (user != null) {
            response.put("user", user);
        }
        
        return response;
    }

    public Map<String, Object> register(String email, String password, String name) {
        Map<String, Object> response = new HashMap<>();
        
        if (userRepository.existsByEmail(email)) {
            response.put("success", false);
            response.put("message", "Email already registered");
            return response;
        }

        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setName(name);
        
        userRepository.save(user);
        
        response.put("success", true);
        response.put("message", "Registration successful");
        return response;
    }

    public Map<String, Object> login(String email, String password, HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        
        User user = userRepository.findByEmail(email)
            .orElse(null);
            
        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            response.put("success", false);
            response.put("message", "Invalid email or password");
            return response;
        }

        // Create a user object without the password
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("id", user.getId());
        userInfo.put("email", user.getEmail());
        userInfo.put("name", user.getName());
        userInfo.put("role", user.getRole());
        
        session.setAttribute("user", userInfo);
        
        response.put("success", true);
        response.put("user", userInfo);
        return response;
    }

    public void logout(HttpSession session) {
        session.invalidate();
    }
} 