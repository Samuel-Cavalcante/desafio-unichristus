package com.agendamento_api.model;

import java.util.Date;
import java.util.UUID;

import com.agendamento_api.model.enums.Horario;
import com.agendamento_api.model.enums.Turno;

public class Agendamento {
	private UUID id;
	private UUID sala_id;
	private Date data;
	private Turno turno;
	private Horario horario;
	private String descricao;

	public Agendamento() {
	}

	public Agendamento(UUID id, UUID sala_id, Date data, Turno turno, Horario horario, String descricao) {
		this.id = id;
		this.sala_id = id;
		this.data = data;
		this.turno = turno;
		this.horario = horario;
		this.descricao = descricao;
	}

	public UUID getId() {
		return id;
	}

	public UUID getSala_id() {
		return sala_id;
	}

	public void setSala_id(UUID sala_id) {
		this.sala_id = sala_id;
	}

	public Date getData() {
		return data;
	}

	public void setData(Date data) {
		this.data = data;
	}

	public Turno getTurno() {
		return turno;
	}

	public void setTurno(Turno turno) {
		this.turno = turno;
	}

	public Horario getHorario() {
		return horario;
	}

	public void setHorario(Horario horario) {
		this.horario = horario;
	}

	public String getDescricao() {
		return descricao;
	}

	public void setDescricao(String descricao) {
		this.descricao = descricao;
	}

	public void setId(UUID id) {
		this.id = id;
	}

}
