package com.online_auction_system_backend.repository;

import com.online_auction_system_backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByOwnerId(Long ownerId);
}
