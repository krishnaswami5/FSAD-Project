package com.auragallery.server.controllers;

import com.auragallery.server.models.Exhibition;
import com.auragallery.server.repositories.ExhibitionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/exhibitions")
public class ExhibitionController {

    @Autowired
    ExhibitionRepository exhibitionRepository;

    @GetMapping
    public ResponseEntity<List<Exhibition>> getAllExhibitions() {
        return ResponseEntity.ok(exhibitionRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Exhibition> getExhibitionById(@PathVariable Long id) {
        return exhibitionRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
