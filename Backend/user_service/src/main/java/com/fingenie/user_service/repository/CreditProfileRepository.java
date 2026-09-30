package com.fingenie.user_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fingenie.user_service.entity.CreditProfile;
@Repository
public interface CreditProfileRepository extends JpaRepository<CreditProfile,Long> {
     public List<CreditProfile> findByUserId(Long id);
}
