package com.online_auction_system_backend.service;

import com.online_auction_system_backend.entity.User;
import com.online_auction_system_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImplements implements UserService {

    private UserRepository userRepository;

    @Autowired
    public UserServiceImplements(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User register(User user) {
        user.setPassword(user.getPassword());
        return userRepository.save(user);
    }

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    @Override
    public User findByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }

    @Override
    public User getFromId(Long id) {
        return userRepository.findById(id).orElse(null);
    }
    
    @Override
    public User saveUser(User user) {
    	return userRepository.save(user);
    }
}

