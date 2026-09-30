package com.fingenie.user_service.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fingenie.user_service.dto.UserSecurityDTO;
import com.fingenie.user_service.dto.UserSecurityResponseDTO;
import com.fingenie.user_service.service.IUserSecurityService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/usersecurity")
public class UserSecurityRestController {

    @Autowired
    private IUserSecurityService service;


    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/addusersecurity")
    public UserSecurityResponseDTO addUserSecurity(@Valid @RequestBody UserSecurityDTO dto) {
        return service.addUserSecurity(dto);
    }

   

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/updateusersecurity/{id}")
    public UserSecurityResponseDTO updateUserSecurity(@Valid @RequestBody UserSecurityDTO dto,
                                                      @PathVariable Long id) {
        return service.updateUserSecurity(dto, id);
    }

    
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/getusersecuritybyid/{id}")
    public UserSecurityResponseDTO getUserSecurityById(@PathVariable Long id) {
        return service.getUserSecurityById(id);
    }

    
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/deleteusersecuritybyid/{id}")
    public String deleteUserSecurity(@PathVariable Long id) {
        service.deleteUserSecurityById(id);
        return "UserSecurity deleted successfully";
    }

    
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/getallusersecurities")
    public List<UserSecurityResponseDTO> getAllUserSecurities() {
        return service.getAllUserSecurities();
    }

    
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/getusersecuritybyuserid/{id}")
    public UserSecurityResponseDTO getUserSecurityByUserId(@PathVariable Long id) {
        return service.getUserSecurityByUserId(id);
    }
}