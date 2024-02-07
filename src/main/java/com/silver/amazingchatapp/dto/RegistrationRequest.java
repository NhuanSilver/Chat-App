package com.silver.amazingchatapp.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class RegistrationRequest {
    @NotEmpty
    private String username;
    @NotEmpty
    private String fullName;
    @NotEmpty
    private String password;
}
