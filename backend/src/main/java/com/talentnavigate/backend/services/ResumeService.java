package com.talentnavigate.backend.services;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class ResumeService {

    private static final Logger logger = LoggerFactory.getLogger(ResumeService.class);

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    public Map<String, Object> parseResume(MultipartFile file) throws Exception {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Uploaded resume file must not be null or empty.");
        }
        
        logger.info("Parsing resume file: {} (size: {} bytes)", file.getOriginalFilename(), file.getSize());

        // Extract text from PDF
        String extractedText = extractTextFromPdf(file);
        
        // If no API key is configured, return mock data
        if (geminiApiKey == null || geminiApiKey.isEmpty() || geminiApiKey.equals("your_api_key_here")) {
            logger.warn("Gemini API Key not configured. Falling back to mock resume data.");
            return mockData();
        }

        // Call Gemini API
        return callGeminiApi(extractedText);
    }

    private String extractTextFromPdf(MultipartFile file) throws Exception {
        try (InputStream is = file.getInputStream();
             PDDocument document = PDDocument.load(is)) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }

    private Map<String, Object> callGeminiApi(String resumeText) throws Exception {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + geminiApiKey;

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String prompt = "You are a resume parsing assistant. Extract the following information from the resume text and format it STRICTLY as a JSON object with the following keys:\n" +
                "- skills (array of strings)\n" +
                "- college (string)\n" +
                "- degree (string)\n" +
                "Only output the raw JSON object, without any markdown formatting or code blocks.\n\n" +
                "Resume text:\n" + resumeText;

        // Gemini API request body format
        Map<String, Object> part = new HashMap<>();
        part.put("text", prompt);
        
        Map<String, Object> content = new HashMap<>();
        content.put("parts", new Object[]{part});

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", new Object[]{content});

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, requestEntity, Map.class);
            Map<String, Object> responseBody = response.getBody();
            
            // Navigate Gemini's response structure to get the text
            // candidates[0].content.parts[0].text
            if (responseBody != null && responseBody.containsKey("candidates")) {
                java.util.List candidates = (java.util.List) responseBody.get("candidates");
                if (!candidates.isEmpty()) {
                    Map<String, Object> candidate = (Map<String, Object>) candidates.get(0);
                    Map<String, Object> contentObj = (Map<String, Object>) candidate.get("content");
                    java.util.List parts = (java.util.List) contentObj.get("parts");
                    if (!parts.isEmpty()) {
                        Map<String, Object> firstPart = (Map<String, Object>) parts.get(0);
                        String jsonString = (String) firstPart.get("text");
                        
                        // Parse the JSON string
                        com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                        return mapper.readValue(jsonString, Map.class);
                    }
                }
            }
            throw new RuntimeException("Failed to parse response from Gemini");
        } catch (Exception e) {
            logger.error("Gemini API call failed during resume parsing. Falling back to mock data: {}", e.getMessage());
            return mockData();
        }
    }

    private Map<String, Object> mockData() {
        Map<String, Object> data = new HashMap<>();
        data.put("skills", new String[]{"Java", "Spring Boot", "React", "TypeScript", "SQL"});
        data.put("college", "University of Mock Data");
        data.put("degree", "B.S. Computer Science");
        return data;
    }
}
