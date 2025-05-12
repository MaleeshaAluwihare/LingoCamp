package com.skillshareplatform.lingocamp.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/lingocamp/api/auth")
public class OAuth2Controller {

    @GetMapping("/google")
    public Map<String, Object> getUserInfo(@AuthenticationPrincipal OAuth2User user) {
        return user.getAttributes(); // Returns user info from Google
    }
}