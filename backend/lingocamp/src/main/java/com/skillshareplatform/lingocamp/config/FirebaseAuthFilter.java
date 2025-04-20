package com.skillshareplatform.lingocamp.config;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.core.GrantedAuthority;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Component
public class FirebaseAuthFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {
        
        String authToken = request.getHeader("Authorization");

        if (authToken != null && authToken.startsWith("Bearer ")) {
            try {
                String token = authToken.substring(7);
                FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(token);

                // Add the token to request so controller can access it
                request.setAttribute("firebaseToken", decodedToken);

                // Give ROLE_USER authority
                List<GrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));

                // Build authentication token
                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                        decodedToken.getUid(),
                        null,
                        authorities
                );

                // ✅ Set authenticated to true
                authenticationToken.setDetails(decodedToken);

                // ✅ Add to context
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);

            } catch (FirebaseAuthException e) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid Firebase token");
                return;
            }
        }

        filterChain.doFilter(request, response);
        System.out.println("Auth set to: " + SecurityContextHolder.getContext().getAuthentication());
    }
    
}

