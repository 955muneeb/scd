package org.example.view;

import static spark.Spark.*;
import org.example.controller.SearchController;

public class Main {
    public static void main(String[] args) {
        port(4567);

         options("/*", (request, response) -> {
            String accessControlRequestHeaders = request.headers("Access-Control-Request-Headers");
            if (accessControlRequestHeaders != null) {
                response.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
            }

            String accessControlRequestMethod = request.headers("Access-Control-Request-Method");
            if (accessControlRequestMethod != null) {
                response.header("Access-Control-Allow-Methods", accessControlRequestMethod);
            }
            return "OK";
        });

        before((request, response) -> {
            response.header("Access-Control-Allow-Origin", "*");
            response.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            response.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        });

        get("/search", (req, res) -> {
            String query = req.queryParams("query");
            String sortBy = req.queryParams("sortBy");
            String language = req.queryParams("language");
            String license = req.queryParams("license");

            if (query == null || query.isEmpty()) {
                return "Query is missing!";
            }

            SearchController searchController = new SearchController();
            return searchController.search(query, sortBy, language, license);
        });


    }
}
