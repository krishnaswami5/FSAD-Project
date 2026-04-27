package com.auragallery.server.payload.response;

import com.auragallery.server.models.User;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JwtResponse {
    private String accessToken;
    private String refreshToken;
    private boolean success;
    private UserResponse user;

    @Data
    @AllArgsConstructor
    public static class UserResponse {
        private Long _id;
        private String name;
        private String email;
        private String role;
        private String avatar;

        public static UserResponse fromUser(User user) {
            return new UserResponse(
                    user.getId(),
                    user.getName(),
                    user.getEmail(),
                    user.getRole().name().toLowerCase(),
                    user.getAvatar()
            );
        }
    }
}
