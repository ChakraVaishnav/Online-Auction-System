package com.online_auction_system_backend.controller;

import com.online_auction_system_backend.entity.User;
import com.online_auction_system_backend.security.JwtUtil;
import com.online_auction_system_backend.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserService userService,
                          PasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    private static final String COOKIE_NAME = "token";

    // ---------------- LOGIN ----------------
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User requestUser, HttpServletResponse response) {

        User user = userService.findByEmail(requestUser.getEmail());

        if (user == null || !passwordEncoder.matches(requestUser.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getUsername());

        ResponseCookie cookie = ResponseCookie.from(COOKIE_NAME, token)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .sameSite("Lax")
                .maxAge(3 * 60 * 60)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        user.setPassword(null);
        return ResponseEntity.ok(user);
    }

    // ---------------- REGISTER ----------------
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User newUser) {

        if (userService.findByEmail(newUser.getEmail()) != null) {
            return ResponseEntity.badRequest().body("Email already registered");
        }

        if (userService.findByUsername(newUser.getUsername()) != null) {
            return ResponseEntity.badRequest().body("Username already taken");
        }

        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));

        User saved = userService.register(newUser);
        saved.setPassword(null);

        return ResponseEntity.ok(saved);
    }

    // ---------------- GET USER BY ID ----------------
    @GetMapping("/by-id")
    public User getById(@RequestParam Long id) {
        User user = userService.getFromId(id);
        if (user != null) user.setPassword(null);
        return user;
    }

    // ---------------- CURRENT LOGGED-IN USER ----------------
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {

        // 1. Read token from cookie
        String token = jwtUtil.extractTokenFromRequest(request);
        if (token == null) {
            return ResponseEntity.status(401).body("Not logged in");
        }

        // 2. Extract username
        String username = jwtUtil.getUsernameFromToken(token);
        if (username == null) {
            return ResponseEntity.status(401).body("Invalid token");
        }

        // 3. Load user
        User user = userService.findByUsername(username);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }

        user.setPassword(null);
        return ResponseEntity.ok(user);
    }
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {

        ResponseCookie cookie = ResponseCookie.from("token", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)               // deletes cookie
                .sameSite("Lax")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok("Logged out successfully");
    }

}
