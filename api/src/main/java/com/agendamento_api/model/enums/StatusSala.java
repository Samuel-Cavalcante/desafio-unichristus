package com.agendamento_api.model.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum StatusSala {
	ATIVA(1), INATIVA(2), EM_MANUTENCAO(3);

	private final int codigo;

	StatusSala(int codigo) {
		this.codigo = codigo;
	}

	@JsonValue
	public int getCodigo() {
		return codigo;
	}
}