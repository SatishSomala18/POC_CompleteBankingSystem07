package com.wipro.auth_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import com.wipro.auth_service.entity.UserSecurity;

@Repository
public interface UserSecurityRepository extends JpaRepository<UserSecurity,Long>{
	public UserSecurity findByUserId(Long id);
}
