package com.wipro.auth_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import com.wipro.auth_service.entity.RefreshToken;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    public RefreshToken findByUserId(Long id);

    public RefreshToken findByToken(String token);
    
    void deleteByUserId(Long userId);
}
