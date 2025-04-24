package com.skillshareplatform.lingocamp.config;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class FirebaseAuthFilter extends OncePerRequestFilter {

    // @Override
    // protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
    //         throws ServletException, IOException {
    //     String token = request.getHeader("Authorization");
    //     if (token != null && token.startsWith("Bearer ")) {
    //         try {
    //             FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(token.substring(7));
    //             PreAuthenticatedAuthenticationToken auth = new PreAuthenticatedAuthenticationToken(decodedToken, null);
    //             SecurityContextHolder.getContext().setAuthentication(auth);
    //         } catch (Exception e) {
    //             response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid Firebase token");
    //             return;
    //         }
    //     }
    //     chain.doFilter(request, response);
    // }
    @Override
protected void doFilterInternal(HttpServletRequest request,
                                HttpServletResponse response,
                                FilterChain filterChain)
        throws ServletException, IOException {

    String header = request.getHeader("Authorization");

    if (header == null || !header.startsWith("Bearer ")) {
        filterChain.doFilter(request, response);
        return;
    }

    String token = header.substring(7);
    try {
        FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(token);
        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        decodedToken, null, List.of()); // store FirebaseToken
        SecurityContextHolder.getContext().setAuthentication(authentication);
    } catch (Exception e) {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        return;
    }

    filterChain.doFilter(request, response);
}

}
