package group16.be;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class AuthFilter extends OncePerRequestFilter{
    
    @Autowired
    private TokenService tokenService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain) throws ServletException, IOException {
        Cookie[] cookies = request.getCookies();
        if(cookies != null) {
            for (Cookie cookie : cookies) {
                if("auth-token".equals(cookie.getName())) {
                    String token = cookie.getValue();
                    if(tokenService.validateToken(token)) {
                        Authentication authentication = tokenService.getAuthentication(token);
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        break; // Exit the loop if a valid token is found
                    }
                }
            }
        }

        filterChain.doFilter(request, response);
    }    
}
