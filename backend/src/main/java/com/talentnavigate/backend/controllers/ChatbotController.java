package com.talentnavigate.backend.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/chatbot")
public class ChatbotController {

    @Value("${gemini.api.key:YOUR_GEMINI_API_KEY}")
    private String geminiApiKey;

    @PostMapping("/ask")
    public ResponseEntity<?> askChatbot(@RequestBody Map<String, Object> request) {
        try {
            String userMessage = (String) request.get("message");
            List<Map<String, String>> history = (List<Map<String, String>>) request.get("history");

            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Construct Gemini Request Body
            Map<String, Object> requestBody = new HashMap<>();
            List<Map<String, Object>> contents = new ArrayList<>();

            // System prompt
            Map<String, Object> systemContent = new HashMap<>();
            systemContent.put("role", "user");
            List<Map<String, String>> systemParts = new ArrayList<>();
            Map<String, String> systemPart = new HashMap<>();
            systemPart.put("text", "You are an expert Career Copilot and AI Assistant for CareerCompass AI. Your job is to help users with their resumes, career advice, interview preparation, and job searching. Keep your answers concise, professional, and highly actionable.");
            systemParts.add(systemPart);
            systemContent.put("parts", systemParts);
            contents.add(systemContent);

            Map<String, Object> systemResponse = new HashMap<>();
            systemResponse.put("role", "model");
            List<Map<String, String>> systemResponseParts = new ArrayList<>();
            Map<String, String> systemResponsePart = new HashMap<>();
            systemResponsePart.put("text", "Understood. I am ready to assist as the CareerCompass AI Copilot.");
            systemResponseParts.add(systemResponsePart);
            systemResponse.put("parts", systemResponseParts);
            contents.add(systemResponse);


            // History
            if (history != null) {
                for (Map<String, String> msg : history) {
                    Map<String, Object> historyContent = new HashMap<>();
                    historyContent.put("role", msg.get("role").equals("user") ? "user" : "model");
                    List<Map<String, String>> parts = new ArrayList<>();
                    Map<String, String> part = new HashMap<>();
                    part.put("text", msg.get("text"));
                    parts.add(part);
                    historyContent.put("parts", parts);
                    contents.add(historyContent);
                }
            }

            // Current message
            Map<String, Object> userContent = new HashMap<>();
            userContent.put("role", "user");
            List<Map<String, String>> userParts = new ArrayList<>();
            Map<String, String> userPart = new HashMap<>();
            userPart.put("text", userMessage);
            userParts.add(userPart);
            userContent.put("parts", userParts);
            contents.add(userContent);

            requestBody.put("contents", contents);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            
            String geminiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + geminiApiKey;
            ResponseEntity<Map> response = restTemplate.postForEntity(geminiUrl, entity, Map.class);
            
            Map<String, Object> responseBody = response.getBody();
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");
            if (candidates != null && !candidates.isEmpty()) {
                Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                String botReply = (String) parts.get(0).get("text");
                return ResponseEntity.ok(Map.of("reply", botReply));
            }

            return ResponseEntity.status(500).body(Map.of("error", "No valid response from Gemini"));
            
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Gemini API Error: " + e.getMessage());
            // Fallback mock response so the UI doesn't break when the API key is invalid
            String keyDisplay = (geminiApiKey != null && geminiApiKey.length() > 8) ? geminiApiKey.substring(0, 8) + "..." : "YOUR_API_KEY";
            String fallbackReply = "Hello! I am Aether. It looks like the Gemini API key provided (`" + keyDisplay + "`) is invalid or not configured properly. \n\nI am currently running in offline mock mode, but the chat interface is fully working! Once you configure a valid API key in `application.properties`, I will be connected to the real AI brain.";
            return ResponseEntity.ok(Map.of("reply", fallbackReply));
        }
    }
}
