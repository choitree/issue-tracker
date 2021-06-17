package com.team11.issue.service;

import com.team11.issue.domain.*;
import com.team11.issue.dto.issue.IssueRequestDTO;
import com.team11.issue.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class IssueService {

    private final UserRepository userRepository;
    private final IssueRepository issueRepository;
    private final AssigneeRepository assigneeRepository;
    private final IssueHasLabelRepository issueHasLabelRepository;
    private final MilestoneRepository milestoneRepository;
    private final LabelRepository labelRepository;

    @Transactional
    public void createIssue(IssueRequestDTO issueRequestDTO, String userName) {
        User user = userRepository.findByName(userName).orElseThrow(RuntimeException::new);
        Milestone milestone = milestoneRepository.findById(issueRequestDTO.getMilestone()).orElseThrow(RuntimeException::new);
        Issue issue = issueRepository.save(Issue.createIssue(user, issueRequestDTO, milestone));

        List<IssueHasLabel> issueHasLabels = issueRequestDTO.getLabels().stream()
                .map(labelId -> IssueHasLabel.createIssueHasLabel(issue, labelRepository.findById(labelId).orElseThrow(RuntimeException::new)))
                .collect(Collectors.toList());
        issueHasLabelRepository.saveAll(issueHasLabels);

        List<Assignees> assignees = issueRequestDTO.getAssignees().stream()
                .map(userId -> Assignees.createAssignees(issue, userRepository.findById(userId).orElseThrow(RuntimeException::new)))
                .collect(Collectors.toList());
        assigneeRepository.saveAll(assignees);
    }
}