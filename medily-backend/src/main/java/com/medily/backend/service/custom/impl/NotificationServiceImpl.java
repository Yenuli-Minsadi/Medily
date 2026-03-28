package com.medily.backend.service.custom.impl;

import com.medily.backend.dto.notification.NotificationResponseDTO;
import com.medily.backend.entity.Notification;
import com.medily.backend.entity.User;
import com.medily.backend.repository.NotificationRepository;
import com.medily.backend.repository.UserRepository;
import com.medily.backend.service.custom.NotificationService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<NotificationResponseDTO> getNotificationsByUser(Long userId) {
        return notificationRepository.findByUserId(userId)
                .stream()
                .map(n -> modelMapper.map(n, NotificationResponseDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setIsRead(true);
        notificationRepository.save(notification);
    }

    @Override
    public void createNotification(Long userId, String message, String type) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(message);
//        notification.setType(type);
        notification.setIsRead(false);
        notificationRepository.save(notification);
    }
}