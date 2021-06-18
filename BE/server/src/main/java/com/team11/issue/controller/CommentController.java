package com.team11.issue.controller;

import com.team11.issue.dto.ResponseDTO;
import com.team11.issue.dto.comment.CommentRequestDTO;
import com.team11.issue.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;
    private final Logger logger = LoggerFactory.getLogger(CommentController.class);

    @PostMapping("/issue/{issueId}/comment")
    public ResponseEntity<ResponseDTO> makeComment(@PathVariable Long issueId, @RequestAttribute String userName, @RequestBody CommentRequestDTO commentRequestDTO) {
        commentService.createComment(issueId, userName, commentRequestDTO);
        return ResponseEntity.ok().body(new ResponseDTO("OK"));
    }
}