package com.team11.issue.service;

import com.team11.issue.domain.User;
import com.team11.issue.dto.oauth.UserInfoDTO;
import com.team11.issue.dto.user.LoginRequestDTO;
import com.team11.issue.dto.user.LoginResponseDTO;
import com.team11.issue.exception.AccessTokenNotFoundException;
import com.team11.issue.oauth.GitHubOauth;
import com.team11.issue.repository.UserRepository;
import com.team11.issue.util.JwtUtil;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final GitHubOauth gitHubOauth;
    private final UserRepository userRepository;

    public UserService(GitHubOauth gitHubOauth, UserRepository userRepository) {
        this.gitHubOauth = gitHubOauth;
        this.userRepository = userRepository;
    }

    private String getAccessToken(LoginRequestDTO loginRequestDTO) {
        return gitHubOauth.getAccessToken(loginRequestDTO).orElseThrow(() -> new AccessTokenNotFoundException());
    }

    private UserInfoDTO getUserInfoFromGitHub(String accessToken) {
        return gitHubOauth.getUserInfoFromGitHub(accessToken);
    }

    private User findByName(String name) {
        /*TODO: Exception 처리*/
        return userRepository.findByName(name).orElseThrow(() -> new RuntimeException());
    }

    private String createJwtToken(String userName) {
        return JwtUtil.createToken(userName);
    }

    private String getJwtToken(String authorization) {
        String jwtToken = null;
        if (authorization.startsWith("Bearer "))
            return jwtToken = authorization.substring(7);
        return jwtToken;
    }

    private boolean verifyUser(String userName) {
        return userRepository.findByName(userName).isPresent();
    }

    public LoginResponseDTO login(LoginRequestDTO loginRequestDTO) {
        String accessToken = getAccessToken(loginRequestDTO);
        UserInfoDTO loginUserInfo = getUserInfoFromGitHub(accessToken);

        if (verifyUser(loginUserInfo.getName())) {
            User user = findByName(loginUserInfo.getName());
            user.updateUser(accessToken);
            userRepository.save(user);
            String jwtToken = createJwtToken(user.getName());
            return new LoginResponseDTO(user, jwtToken);
        }

        User saveUser = new User(loginUserInfo, accessToken);
        userRepository.save(saveUser);

        User user = findByName(loginUserInfo.getName());
        String jwtToken = createJwtToken(user.getName());

        return new LoginResponseDTO(user, jwtToken);

    }

    public void logout(String authorization) {
        String jwtToken = getJwtToken(authorization);
        String userName = JwtUtil.getUserIdFromJwtToken(jwtToken);

        User user = findByName(userName);
        user.removeAccessToken();

        userRepository.save(user);
    }
}
