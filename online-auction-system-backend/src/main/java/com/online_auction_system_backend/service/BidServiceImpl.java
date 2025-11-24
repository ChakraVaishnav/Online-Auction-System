package com.online_auction_system_backend.service;

import com.online_auction_system_backend.entity.Bid;
import com.online_auction_system_backend.entity.Product;
import com.online_auction_system_backend.repository.BidRepository;
import com.online_auction_system_backend.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BidServiceImpl implements BidService {

    private BidRepository bidRepository;
    private ProductRepository productRepository;

    public BidServiceImpl(BidRepository bidRepository, ProductRepository productRepository){
        this.bidRepository = bidRepository;
        this.productRepository = productRepository;
    }

    @Override
    public Bid placeBid(Long productId, Long userId, Double amount) {

        Product product = productRepository.findById(productId).orElse(null);

        if (product == null) return null;

        if (!product.getStatus().equals("LIVE")) return null;

        if (amount <= product.getCurrentBid()) return null;

        // Update product highest bid
        product.setCurrentBid(amount);
        product.setHighestBidderId(userId);
        productRepository.save(product);

        // Save bid history
        Bid bid = new Bid();
        bid.setProductId(productId);
        bid.setUserId(userId);
        bid.setAmount(amount);
        bid.setCreatedAt(LocalDateTime.now());


        return bidRepository.save(bid);
    }

    @Override
    public List<Bid> getBidsForProduct(Long productId) {
        return bidRepository.findByProductIdOrderByCreatedAtDesc(productId);
    }

    @Override
    public List<Bid> getBidsByUser(Long userId) {
        return bidRepository.findByUserId(userId);
    }
}
