package com.online_auction_system_backend.service;

import com.online_auction_system_backend.entity.Product;

import java.util.List;

public interface ProductService {

    Product createProduct(Product product);

    Product getProduct(Long id);

    List<Product> getAllProducts();

    List<Product> getProductsByOwner(Long ownerId);

    Product save(Product product);

	String delete(Product product);
}
