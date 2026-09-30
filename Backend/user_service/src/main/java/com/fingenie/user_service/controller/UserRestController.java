package com.fingenie.user_service.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.fingenie.user_service.dto.KycRequestDTO;
import com.fingenie.user_service.dto.UserDTO;
import com.fingenie.user_service.dto.UserResponseDTO;
import com.fingenie.user_service.service.IUserService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/users")
public class UserRestController {

    @Autowired
    private IUserService userService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/adduser")
    public UserResponseDTO addUser(@Valid @RequestBody UserDTO userDTO) {
        return userService.addUser(userDTO);
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PutMapping("/updateuser/{id}")
    public UserResponseDTO updateUser(@Valid @RequestBody UserDTO userDTO,
            @PathVariable Long id) {
        return userService.updateUser(userDTO, id);
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping("/getuserbyid/{id}")
    public UserResponseDTO getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/getallusers")
    public List<UserResponseDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/deleteuserbyid/{id}")
    public String deleteUser(@PathVariable Long id) {
        userService.deleteUserById(id);
        return "User deleted successfully";
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/getusersbyrole/{role}")
    public List<UserResponseDTO> getUsersByRole(@PathVariable String role) {
        return userService.getUsersByRole(role);
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PutMapping("/submitkyc/{id}")
    public UserResponseDTO submitKyc(@Valid @RequestBody KycRequestDTO dto,
            @PathVariable Long id) {
        return userService.submitKyc(id, dto);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/approvekycbyid/{id}")
    public UserResponseDTO approveKyc(@PathVariable Long id) {
        return userService.approveKyc(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/rejectkycbyid/{id}")
    public UserResponseDTO rejectKyc(@PathVariable Long id) {
        return userService.rejectKyc(id);
    }
}