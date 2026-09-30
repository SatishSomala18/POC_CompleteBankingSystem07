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

import com.fingenie.user_service.dto.CreditProfileDTO;
import com.fingenie.user_service.dto.CreditProfileResponseDTO;
import com.fingenie.user_service.service.ICreditProfileService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/creditprofiles")
public class CreditProfileRestController {

    @Autowired
    private ICreditProfileService service;

   
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/addprofile")
    public CreditProfileResponseDTO addProfile(@Valid @RequestBody CreditProfileDTO dto) {
        return service.addProfile(dto);
    }

    
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/updateprofile/{id}")
    public CreditProfileResponseDTO updateProfile(@Valid @RequestBody CreditProfileDTO dto,
                                                  @PathVariable Long id) {
        return service.updateProfile(dto, id);
    }

   
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping("/getprofilebyid/{id}")
    public CreditProfileResponseDTO getProfileById(@PathVariable Long id) {
        return service.getProfileById(id);
    }

   
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/getallprofiles")
    public List<CreditProfileResponseDTO> getAllProfiles() {
        return service.getAllProfiles();
    }

   
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/deleteprofilebyid/{id}")
    public String deleteProfile(@PathVariable Long id) {
        service.deleteProfileById(id);
        return "Credit profile deleted successfully";
    }


    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping("/getprofilebyuserid/{id}")
    public List<CreditProfileResponseDTO> getProfilesByUserId(@PathVariable Long id) {
        return service.getProfilesByUserId(id);
    }
}