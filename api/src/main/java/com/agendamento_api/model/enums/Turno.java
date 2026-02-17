package com.agendamento_api.model.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum Turno {
	MANHA(1), TARDE(2), NOITE(3);

	private final int codigo;

	Turno(int codigo) {
		this.codigo = codigo;
	}

	@JsonValue
	public int getCodigo() {
		return codigo;
	}
}