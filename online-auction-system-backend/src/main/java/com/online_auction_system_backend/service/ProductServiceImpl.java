package com.online_auction_system_backend.service;

import com.online_auction_system_backend.entity.Product;
import com.online_auction_system_backend.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    private ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository){
        this.productRepository = productRepository;
    }

    @Override
    public Product createProduct(Product product) {
    	
        product.setCurrentBid(product.getStartingPrice());
        product.setStatus("LIVE");
        return productRepository.save(product);
    }

    @Override
    public Product getProduct(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public List<Product> getProductsByOwner(Long ownerId) {
        return productRepository.findByOwnerId(ownerId);
    }

    @Override
    public Product save(Product product) {
        return productRepository.save(product);
    }
    
    @Override
    public String delete(Product product) {
    	productRepository.delete(product);
    	return "Ended";
    }
}
