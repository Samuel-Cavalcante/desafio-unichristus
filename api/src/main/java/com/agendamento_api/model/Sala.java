package com.agendamento_api.model;

import java.util.UUID;

import com.agendamento_api.model.enums.StatusSala;

public class Sala {
	private UUID id;
	private String descricao;
	private String andar;
	private int capacidade;
	private StatusSala status;

	public Sala() {
	}

	public Sala(UUID id, String descricao, String andar, int capacidade, StatusSala ativa) {
		this.id = id;
		this.descricao = descricao;
		this.andar = andar;
		this.capacidade = capacidade;
		this.status = ativa;
	}

	public UUID getId() {
		return id;
	}

	public void setId(UUID id) {
		this.id = id;
	}

	public String getDescricao() {
		return descricao;
	}

	public void setDescricao(String descricao) {
		this.descricao = descricao;
	}

	public String getAndar() {
		return andar;
	}

	public void setAndar(String andar) {
		this.andar = andar;
	}

	public int getCapacidade() {
		return capacidade;
	}

	public void setCapacidade(int capacidade) {
		this.capacidade = capacidade;
	}

	public StatusSala getStatus() {
		return status;
	}

	public void setStatus(StatusSala status) {
		this.status = status;
	}

}
