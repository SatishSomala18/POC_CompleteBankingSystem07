package com.fingenie.user_service.service;

import java.util.List;

import com.fingenie.user_service.dto.KycRequestDTO;
import com.fingenie.user_service.dto.UserDTO;
import com.fingenie.user_service.dto.UserResponseDTO;

public interface IUserService {
	public UserResponseDTO addUser(UserDTO userto);

	public UserResponseDTO updateUser(UserDTO userto, Long id);

	public UserResponseDTO getUserById(Long id);

	public List<UserResponseDTO> getAllUsers();

	public void deleteUserById(Long id);

	public List<UserResponseDTO> getUsersByRole(String role);

	public UserResponseDTO submitKyc(Long id, KycRequestDTO dto);

	public UserResponseDTO approveKyc(Long id);

	public UserResponseDTO rejectKyc(Long id);

}
