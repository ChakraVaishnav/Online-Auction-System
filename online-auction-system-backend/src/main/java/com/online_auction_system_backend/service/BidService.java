package com.online_auction_system_backend.service;

import com.online_auction_system_backend.entity.Bid;

import java.util.List;

public interface BidService {

    Bid placeBid(Long productId, Long userId, Double amount);

    List<Bid> getBidsForProduct(Long productId);

    List<Bid> getBidsByUser(Long userId);
}
