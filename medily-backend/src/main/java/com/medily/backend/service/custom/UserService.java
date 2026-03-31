package com.medily.backend.service.custom;

import com.medily.backend.dto.user.UserResponseDTO;

import java.util.List;

public interface UserService {
    List<UserResponseDTO> getAllUsers();
    UserResponseDTO getUserById(Integer id);
    void deleteUser(Integer id);
}