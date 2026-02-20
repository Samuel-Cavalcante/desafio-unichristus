"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, dateFnsLocalizer, Event as CalendarEvent, View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styles from './agenda.module.css';

interface Sala {
  id: string;
  descricao: string;
  andar: string;
  capacidade: number;
}

interface Agendamento {
  id: string;
  salaId?: string;
  sala_id?: string;
  sala?: { id: string }; // Caso o Java esteja enviando o objeto inteiro da sala
  data: string; 
  turno: number;
  horario: number;
  descricao: string;
}

interface MeuEvento extends CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resourceId: string;
  resource: Agendamento; 
}

const locales = { 'pt-BR': ptBR };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const turnosLabel: { [key: number]: string } = { 1: 'Manhã', 2: 'Tarde', 3: 'Noite' };
const horariosLabel: { [key: number]: string } = { 1: 'A', 2: 'B', 3: 'C', 4: 'D', 5: 'E', 6: 'F' };

const getHorarioReal = (dataBase: string, turno: number, horario: number): Date => {
  const data = new Date(dataBase);
  let horaInicio = 8;
  if (turno === 1) horaInicio = 7;
  if (turno === 2) horaInicio = 13;
  if (turno === 3) horaInicio = 18;
  const offset = horario - 1;
  data.setHours(horaInicio + offset, 0, 0);
  return data;
};

const CustomToolbar = (toolbar: any) => {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const [year, month] = e.target.value.split('-');
      const newDate = new Date(Number(year), Number(month) - 1, 1);
      toolbar.onNavigate('DATE', newDate);
    }
  };

  const year = toolbar.date.getFullYear();
  const month = String(toolbar.date.getMonth() + 1).padStart(2, '0');
  const currentMonthValue = `${year}-${month}`;

  return (
    <div className={styles.customToolbar}>
      <div className={styles.toolbarLeft}>
        <span className={styles.toolbarDateLabel}>{toolbar.label}</span>
        <div className={styles.datePickerContainer}>
          <button className={styles.btnCalendarIcon} title="Escolher mês">📅</button>
          <input type="month" className={styles.hiddenMonthInput} value={currentMonthValue} onChange={handleDateChange} />
        </div>
        <button className={styles.btnToday} onClick={() => toolbar.onNavigate('TODAY')}>Hoje</button>
      </div>
      <div className={styles.toolbarRight}>
        <div className={styles.viewGroup}>
          <button className={toolbar.view === 'month' ? styles.btnViewActive : styles.btnView} onClick={() => toolbar.onView('month')}>Mês</button>
          <button className={toolbar.view === 'week' ? styles.btnViewActive : styles.btnView} onClick={() => toolbar.onView('week')}>Semana</button>
          <button className={toolbar.view === 'day' ? styles.btnViewActive : styles.btnView} onClick={() => toolbar.onView('day')}>Dia</button>
        </div>
      </div>
    </div>
  );
};

export default function AgendaPage() {
  const [eventos, setEventos] = useState<MeuEvento[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);
  
  const [salaSelecionada, setSalaSelecionada] = useState<string | null>(null);
  const [andaresExpandidos, setAndaresExpandidos] = useState<Record<string, boolean>>({});

  const [view, setView] = useState<View>('week');
  const [date, setDate] = useState(new Date());

  const [modalDetalhes, setModalDetalhes] = useState(false);
  const [modalForm, setModalForm] = useState(false);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState<Agendamento | null>(null);
  
  const [formData, setFormData] = useState({
    id: '', salaId: '', data: '', turno: 1, horario: 1, descricao: ''
  });

  const carregarDados = async () => {
    try {
      const resSalas = await fetch('http://localhost:8080/api/salas');
      const dataSalas: Sala[] = await resSalas.json();
      setSalas(dataSalas);

      const andaresIniciais: Record<string, boolean> = {};
      dataSalas.forEach(s => { andaresIniciais[s.andar] = true; });
      setAndaresExpandidos(andaresIniciais);

      const resAgendamentos = await fetch('http://localhost:8080/api/agendamentos');
      const dataAgendamentos: Agendamento[] = await resAgendamentos.json();

      const eventosFormatados: MeuEvento[] = dataAgendamentos.map((ag) => {
        const start = getHorarioReal(ag.data, ag.turno, ag.horario);
        const end = new Date(start);
        end.setHours(start.getHours() + 1); 

        // AQUI ESTÁ A CORREÇÃO PRINCIPAL: 
        // Pega o ID de qualquer forma que o Java mandar e força para texto minúsculo.
        const idDaSalaCru = ag.sala_id || ag.salaId || ag.sala?.id || '';
        const idDaSalaFormatado = String(idDaSalaCru).toLowerCase();

        return {
          id: ag.id,
          title: ag.descricao,
          start: start,
          end: end,
          resourceId: idDaSalaFormatado, // Salva formatado
          resource: ag
        };
      });

      console.log("--- DEBUG DE DADOS ---");
      console.log("Salas carregadas: ", dataSalas);
      console.log("Agendamentos carregados: ", eventosFormatados);

      setEventos(eventosFormatados);
    } catch (error) {
      console.error("Erro ao conectar", error);
    }
  };

  useEffect(() => { carregarDados(); }, []);

  const salasPorAndar = useMemo(() => {
    return salas.reduce((acc, sala) => {
      if (!acc[sala.andar]) acc[sala.andar] = [];
      acc[sala.andar].push(sala);
      return acc;
    }, {} as Record<string, Sala[]>);
  }, [salas]);

  // CORREÇÃO DO FILTRO: Compara sempre os dois em letras minúsculas
  const eventosFiltrados = useMemo(() => {
    if (!salaSelecionada) return eventos;
    
    const salaSelecionadaFormatada = String(salaSelecionada).toLowerCase();
    
    return eventos.filter(ev => ev.resourceId === salaSelecionadaFormatada);
  }, [eventos, salaSelecionada]);

  const toggleAndar = (andar: string) => {
    setAndaresExpandidos(prev => ({ ...prev, [andar]: !prev[andar] }));
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      sala_id: formData.salaId,
      salaId: formData.salaId, 
      data: formData.data, 
      turno: Number(formData.turno),
      horario: Number(formData.horario), 
      descricao: formData.descricao
    };
    
    const isEdicao = formData.id !== '';
    const url = isEdicao ? `http://localhost:8080/api/agendamentos/${formData.id}` : `http://localhost:8080/api/agendamentos`;

    await fetch(url, { method: isEdicao ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    setModalForm(false);
    carregarDados();
  };

  const handleExcluir = async () => {
    if (!agendamentoSelecionado) return;
    if (confirm('Tem certeza que deseja excluir?')) {
      await fetch(`http://localhost:8080/api/agendamentos/${agendamentoSelecionado.id}`, { method: 'DELETE' });
      setModalDetalhes(false);
      carregarDados();
    }
  };

  const abrirFormNovo = () => {
    const salaPadrao = salaSelecionada || (salas.length > 0 ? salas[0].id : '');
    setFormData({ id: '', salaId: salaPadrao, data: new Date().toISOString().split('T')[0], turno: 1, horario: 1, descricao: '' });
    setModalForm(true);
  };

  const abrirFormEditar = () => {
    if (!agendamentoSelecionado) return;
    const ag = agendamentoSelecionado;
    let dataFormatada = ag.data ? new Date(ag.data).toISOString().split('T')[0] : '';
    const idDaSala = ag.sala_id || ag.salaId || ag.sala?.id || '';
    
    setFormData({ id: ag.id, salaId: idDaSala, data: dataFormatada, turno: ag.turno, horario: ag.horario, descricao: ag.descricao });
    setModalDetalhes(false);
    setModalForm(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Gestão de Salas</h1>
        <button onClick={abrirFormNovo} className={`${styles.btn} ${styles.btnPrimary}`}>+ Novo Agendamento</button>
      </div>
      
      <div className={styles.mainLayout}>
        <aside className={styles.sidebar}>
          <h2 className={styles.sidebarTitle}>Salas</h2>
          
          <button 
            className={styles.showAllBtn} 
            onClick={() => setSalaSelecionada(null)}
            style={salaSelecionada === null ? { backgroundColor: '#e2e8f0', color: '#0f172a' } : {}}
          >
            Exibir Todas as Salas
          </button>

          {Object.entries(salasPorAndar).map(([andar, salasDoAndar]) => (
            <div key={andar}>
              <div className={styles.floorHeader} onClick={() => toggleAndar(andar)}>
                <span>{andar}</span>
                <span>{andaresExpandidos[andar] ? '▼' : '▶'}</span>
              </div>
              
              {andaresExpandidos[andar] && (
                <ul className={styles.roomList}>
                  {salasDoAndar.map(sala => (
                    <li 
                      key={sala.id} 
                      className={`${styles.roomItem} ${salaSelecionada === sala.id ? styles.roomItemActive : ''}`}
                      onClick={() => setSalaSelecionada(sala.id)}
                    >
                      {sala.descricao}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </aside>

        <div className={styles.calendarWrapper}>
          <Calendar
            localizer={localizer}
            events={eventosFiltrados}
            view={view}
            onView={setView}
            date={date}
            onNavigate={setDate}
            startAccessor="start"
            endAccessor="end"
            min={new Date(0, 0, 0, 7, 0, 0)}
            max={new Date(0, 0, 0, 23, 0, 0)}
            style={{ height: '75vh' }}
            culture='pt-BR'
            components={{ toolbar: CustomToolbar }}
            onSelectEvent={(e) => { setAgendamentoSelecionado(e.resource); setModalDetalhes(true); }}
            eventPropGetter={(event) => {
              let bg = '#3b82f6';
              if (event.resource.turno === 2) bg = '#f59e0b';
              if (event.resource.turno === 3) bg = '#6366f1';
              return { style: { backgroundColor: bg, borderRadius: '6px', color: 'white', border: 'none', fontSize: '12px', padding: '2px 5px' }};
            }}
          />
        </div>
      </div>

      {modalDetalhes && agendamentoSelecionado && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>Detalhes da Reserva</h3>
            <div className={styles.detailRow}><strong>Descrição:</strong> {agendamentoSelecionado.descricao}</div>
            <div className={styles.detailRow}><strong>Data:</strong> {new Date(agendamentoSelecionado.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</div>
            <div className={styles.detailRow}>
              <strong>Sala:</strong> {salas.find(s => s.id === (agendamentoSelecionado.sala_id || agendamentoSelecionado.salaId || agendamentoSelecionado.sala?.id))?.descricao}
            </div>
            <div className={styles.detailRow}><strong>Turno:</strong> {turnosLabel[agendamentoSelecionado.turno]}</div>
            <div className={styles.detailRow}><strong>Horário:</strong> {horariosLabel[agendamentoSelecionado.horario]}</div>
            <div className={styles.actions}>
              <button onClick={abrirFormEditar} className={`${styles.btn} ${styles.btnEdit}`}>Editar</button>
              <button onClick={handleExcluir} className={`${styles.btn} ${styles.btnDelete}`}>Excluir</button>
              <button onClick={() => setModalDetalhes(false)} className={`${styles.btn} ${styles.btnClose}`}>Fechar</button>
            </div>
          </div>
        </div>
      )}

      {modalForm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>{formData.id ? 'Editar Agendamento' : 'Novo Agendamento'}</h3>
            <form onSubmit={handleSalvar} className={styles.formGroup}>
              <div>
                  <label className={styles.label}>Sala:</label>
                  <select className={styles.input} value={formData.salaId} onChange={e => setFormData({...formData, salaId: e.target.value})} required>
                    {salas.map(sala => (
                      <option key={sala.id} value={sala.id}>{sala.descricao} ({sala.andar})</option>
                    ))}
                  </select>
              </div>
              <div>
                  <label className={styles.label}>Data:</label>
                  <input type="date" className={styles.input} value={formData.data} onChange={e => setFormData({...formData, data: e.target.value})} required />
              </div>
              <div className={styles.row}>
                <div className={styles.col}>
                  <label className={styles.label}>Turno:</label>
                  <select className={styles.input} value={formData.turno} onChange={e => setFormData({...formData, turno: Number(e.target.value)})}>
                    <option value={1}>Manhã</option><option value={2}>Tarde</option><option value={3}>Noite</option>
                  </select>
                </div>
                <div className={styles.col}>
                  <label className={styles.label}>Horário:</label>
                  <select className={styles.input} value={formData.horario} onChange={e => setFormData({...formData, horario: Number(e.target.value)})}>
                    {[1,2,3,4,5,6].map(num => <option key={num} value={num}>{horariosLabel[num]}</option>)}
                  </select>
                </div>
              </div>
              <div>
                  <label className={styles.label}>Descrição / Turma:</label>
                  <input type="text" className={styles.input} value={formData.descricao} onChange={e => setFormData({...formData, descricao: e.target.value})} placeholder="Ex: Aula de Anatomia" required />
              </div>
              <div className={styles.actions}>
                <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>Salvar</button>
                <button type="button" onClick={() => setModalForm(false)} className={`${styles.btn} ${styles.btnClose}`}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}