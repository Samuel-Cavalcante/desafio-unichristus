package com.agendamento_api.controller;

import com.agendamento_api.model.Sala;
import com.agendamento_api.service.AgendamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/salas")
@CrossOrigin(origins = "*") 
public class SalaController {

    @Autowired
    private AgendamentoService service;

    @GetMapping
    public ResponseEntity<List<Sala>> listarSalas() {
        return ResponseEntity.ok(service.listarSalas());
    }
}