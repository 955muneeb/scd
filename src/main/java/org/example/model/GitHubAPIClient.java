package org.example.model;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

public class GitHubAPIClient {

    public String searchRepositories(String query, String sortBy, String language, String license) {
        try {
            StringBuilder urlBuilder = new StringBuilder("https://api.github.com/search/repositories?q=" + URLEncoder.encode(query, "UTF-8"));

            // Adding filters
            if (language != null && !language.isEmpty()) {
                urlBuilder.append("+language:" + URLEncoder.encode(language, "UTF-8"));
            }
            if (license != null && !license.isEmpty()) {
                urlBuilder.append("+license:" + URLEncoder.encode(license, "UTF-8"));
            }

            // Sorting option
            if (sortBy != null && !sortBy.isEmpty()) {
                urlBuilder.append("&sort=" + URLEncoder.encode(sortBy, "UTF-8"));
                urlBuilder.append("&order=desc");  // Default to descending order
            }

            URL url = new URL(urlBuilder.toString());
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.setRequestProperty("Accept", "application/vnd.github.v3+json");

            BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            StringBuilder response = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                response.append(line);
            }
            reader.close();
            connection.disconnect();

            return response.toString();
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"error\":\"Error occurred while searching repositories.\"}";
        }
    }
}
