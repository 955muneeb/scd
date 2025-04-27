package org.example.controller;

import org.example.model.GitHubAPIClient;

public class SearchController {
    private GitHubAPIClient gitHubAPIClient = new GitHubAPIClient();

    public String search(String query, String sortBy, String language, String license) {
        return gitHubAPIClient.searchRepositories(query, sortBy, language, license);
    }
}
