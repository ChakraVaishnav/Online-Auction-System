package com.online_auction_system_backend.controller;

import com.online_auction_system_backend.entity.Bid;
import com.online_auction_system_backend.service.BidService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bids")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class BidController {

    private BidService bidService;

    public BidController(BidService bidService){
        this.bidService = bidService;
    }

    @PostMapping("/place")
    public Bid placeBid(@RequestParam Long productId,
                        @RequestParam Long userId,
                        @RequestParam Double amount){
        return bidService.placeBid(productId, userId, amount);
    }

    @GetMapping("/product/{productId}")
    public List<Bid> getProductBids(@PathVariable Long productId){
        return bidService.getBidsForProduct(productId);
    }

    @GetMapping("/user/{userId}")
    public List<Bid> getUserBids(@PathVariable Long userId){
        return bidService.getBidsByUser(userId);
    }
}
