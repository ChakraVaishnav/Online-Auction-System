package com.online_auction_system_backend.service;

import com.online_auction_system_backend.entity.User;

public interface UserService {
    User register(User user);
    User findByEmail(String email);
    User findByUsername(String username);
	User getFromId(Long id);
	User saveUser(User user);
}
