package com.fingenie.user_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fingenie.user_service.dto.UserDTO;
import com.fingenie.user_service.entity.User;
@Repository
public interface UserRepository extends JpaRepository<User,Long>{
	
	public List<User> findByRoles(String role);

}
