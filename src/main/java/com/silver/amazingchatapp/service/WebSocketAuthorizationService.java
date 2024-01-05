package com.silver.amazingchatapp.service;

import com.silver.amazingchatapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
@Slf4j
public class WebSocketAuthorizationService {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public UsernamePasswordAuthenticationToken authenticationToken(String token) {

            if (!(StringUtils.hasText(token) && token.startsWith("Bearer ")))
                throw new AuthenticationCredentialsNotFoundException("Token mustn't empty or must start with Bearer");
            final String accessToken = token.substring(7);
            final String username = jwtService.extractUsername(accessToken);

            if (username == null) throw new BadCredentialsException("Username invalid");

            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            if (!jwtService.isTokenValid(accessToken, userDetails)) throw new BadCredentialsException("Token invalid");

            return new UsernamePasswordAuthenticationToken(
                    userDetails.getUsername(),
                    null,
                    userDetails.getAuthorities()
            );

    }
}
