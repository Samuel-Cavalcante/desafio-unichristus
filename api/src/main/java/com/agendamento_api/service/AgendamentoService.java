package com.agendamento_api.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import com.agendamento_api.model.Agendamento;
import com.agendamento_api.model.Sala;
import com.agendamento_api.model.enums.Horario;
import com.agendamento_api.model.enums.StatusSala;
import com.agendamento_api.model.enums.Turno;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

@Service
public class AgendamentoService {

	private List<Sala> salasMock = new ArrayList<>();
	private List<Agendamento> agendamentosMock = new ArrayList<>();

	@PostConstruct
	public void init() {
		Sala s1 = new Sala(UUID.randomUUID(), "Lab Informática", "1º Andar", 30, StatusSala.ATIVA);
		Sala s2 = new Sala(UUID.randomUUID(), "Sala Reunião", "2º Andar", 10, StatusSala.EM_MANUTENCAO);
		
		salasMock.add(s1);
		salasMock.add(s2);

		Agendamento ag1 = new Agendamento(UUID.randomUUID(), s1.getId(), new Date(), Turno.MANHA, Horario.A,
				"Aula de Estrutura de Dados");
		
		Agendamento ag2 = new Agendamento(UUID.randomUUID(), s1.getId(), new Date(), Turno.TARDE, Horario.B,
				"Aula de Logica de Programação");
		
		agendamentosMock.add(ag1);
		agendamentosMock.add(ag2);


		System.out.println("Sistema iniciado. ID da Sala 1: " + s1.getId());
	}

	public List<Agendamento> listarTodos() {
		return agendamentosMock;
	}

	public Agendamento buscarPorId(UUID id) {
		for (Agendamento ag : agendamentosMock) {
			if (ag.getId().equals(id)) {
				return ag;
			}
		}
		return null;
	}

	public Agendamento salvar(Agendamento agendamento) {
		agendamento.setId(UUID.randomUUID());
		agendamentosMock.add(agendamento);
		return agendamento;
	}

	public Agendamento atualizar(UUID id, Agendamento dadosNovos) {
		Agendamento agendamentoExistente = buscarPorId(id);

		if (agendamentoExistente != null) {
			agendamentoExistente.setSala_id(dadosNovos.getSala_id());
			agendamentoExistente.setData(dadosNovos.getData());
			agendamentoExistente.setTurno(dadosNovos.getTurno());
			agendamentoExistente.setHorario(dadosNovos.getHorario());
			agendamentoExistente.setDescricao(dadosNovos.getDescricao());
			return agendamentoExistente;
		}
		return null;
	}

	public boolean deletar(UUID id) {
		Agendamento ag = buscarPorId(id);
		if (ag != null) {
			agendamentosMock.remove(ag);
			return true;
		}
		return false;
	}

	public List<Sala> listarSalas() {
		return salasMock;
	}
}