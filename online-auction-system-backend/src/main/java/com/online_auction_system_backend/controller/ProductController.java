package com.online_auction_system_backend.controller;

import com.online_auction_system_backend.entity.Product;
import com.online_auction_system_backend.entity.User;
import com.online_auction_system_backend.security.JwtUtil;
import com.online_auction_system_backend.service.ProductService;
import com.online_auction_system_backend.service.UserService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ProductController {

    private ProductService productService;
    private JwtUtil jwtUtil;
    private UserService userService;
    public ProductController(ProductService productService, 
            UserService userService,
            JwtUtil jwtUtil) {
this.productService = productService;
this.userService = userService;
this.jwtUtil = jwtUtil;
}
    @PostMapping("/add")
    public ResponseEntity<?> addProduct(@RequestBody Product product, HttpServletRequest request) {

        // 1. Get token from cookie
        String token = jwtUtil.extractTokenFromRequest(request);
        if (token == null) {
            return ResponseEntity.status(401).body("Unauthorized - no token");
        }

        // 2. Extract username from JWT
        String username = jwtUtil.getUsernameFromToken(token);
        if (username == null) {
            return ResponseEntity.status(401).body("Invalid token");
        }

        // 3. Fetch user by username
        User owner = userService.findByUsername(username);
        if (owner == null) {
            return ResponseEntity.status(404).body("User not found");
        }

        // 4. Assign ownerId
        product.setOwnerId(owner.getId());

        // 5. Create product
        Product saved = productService.createProduct(product);

        return ResponseEntity.ok(saved);
    }


    @GetMapping("/{id}")
    public Product getProduct(@PathVariable Long id){
        return productService.getProduct(id);
    }

    @GetMapping("/all")
    public List<Product> getAll(){
        return productService.getAllProducts();
    }

    @GetMapping("/owner/{ownerId}")
    public List<Product> ownerProducts(@PathVariable Long ownerId){
        return productService.getProductsByOwner(ownerId);
    }

    @PostMapping("/end/{id}")
    public String endAuction(@PathVariable Long id){
        Product product = productService.getProduct(id);
        if (product == null) return "Not Found";
        User owner = userService.getFromId(product.getOwnerId());
        User highest=userService.getFromId(product.getHighestBidderId());
        double ownerbal= owner.getBalance()+product.getCurrentBid();
        double highestBidderBal=highest.getBalance()-product.getCurrentBid();
        owner.setBalance((long)ownerbal);
        highest.setBalance((long)highestBidderBal);
        productService.delete(product);
        userService.saveUser(highest);
        userService.saveUser(owner);
        return "Auction Ended";
    }
}
