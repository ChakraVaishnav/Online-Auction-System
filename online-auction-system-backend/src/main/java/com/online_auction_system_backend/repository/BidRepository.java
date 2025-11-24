package com.online_auction_system_backend.repository;

import com.online_auction_system_backend.entity.Bid;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BidRepository extends JpaRepository<Bid, Long> {

    List<Bid> findByProductIdOrderByCreatedAtDesc(Long productId);
    List<Bid> findByUserId(Long userId);
}
