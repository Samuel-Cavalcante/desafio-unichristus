package com.agendamento_api.model.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum Horario {
	A(1), B(2), C(3), D(4), E(5), F(6);

	private final int codigo;

	Horario(int codigo) {
		this.codigo = codigo;
	}

	@JsonValue
	public int getstatus() {
		return codigo;
	}
}