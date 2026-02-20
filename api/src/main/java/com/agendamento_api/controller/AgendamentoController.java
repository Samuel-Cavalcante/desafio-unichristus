package com.agendamento_api.controller;

import com.agendamento_api.model.Agendamento;
import com.agendamento_api.service.AgendamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/agendamentos")
@CrossOrigin(origins = "*")
public class AgendamentoController {

	@Autowired
	private AgendamentoService service;

	@GetMapping
	public ResponseEntity<List<Agendamento>> listarTodos() {
		return ResponseEntity.ok(service.listarTodos());
	}

	@GetMapping("/{id}")
	public ResponseEntity<Agendamento> buscarPorId(@PathVariable UUID id) {
		Agendamento agendamento = service.buscarPorId(id);
		if (agendamento != null) {
			return ResponseEntity.ok(agendamento);
		}
		return ResponseEntity.notFound().build();
	}

	@PostMapping
	public ResponseEntity<Agendamento> inserir(@RequestBody Agendamento agendamento) {
		Agendamento salvo = service.salvar(agendamento);
		return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
	}

	@PutMapping("/{id}")
	public ResponseEntity<Agendamento> atualizar(@PathVariable UUID id, @RequestBody Agendamento agendamento) {
		Agendamento atualizado = service.atualizar(id, agendamento);
		if (atualizado != null) {
			return ResponseEntity.ok(atualizado);
		}
		return ResponseEntity.notFound().build();
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deletar(@PathVariable UUID id) {
		boolean deletado = service.deletar(id);
		if (deletado) {
			return ResponseEntity.noContent().build();
		}
		return ResponseEntity.notFound().build();
	}
}