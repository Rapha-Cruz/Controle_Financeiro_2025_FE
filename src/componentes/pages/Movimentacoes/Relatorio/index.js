import React, { useState, useEffect } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import styled from 'styled-components';

const Corpo = styled.div`
    background-color: #2A83F0;
    padding: 10px;
    width: 100vw; // Garante que o corpo ocupe toda a altura da viewport
    min-height: 100vh;
    display: flex; // Necessário para centralizar o conteúdo com o wrapper abaixo
`;

// Helper function to make the API call for updating a movimentacao
const atualizarMovimentacaoAPI = async (id, dadosMovimentacao) => {
  try {
    // Ensure valor is a number
    const carregar = {
      ...dadosMovimentacao,
      valor: parseFloat(dadosMovimentacao.valor),
    };

    const resposta = await fetch(`http://localhost:3000/movimentacoes/atualizarMovimentacao/${id}`, { // Adjust endpoint if needed
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(carregar),
    });
    if (!resposta.ok) {
      const errorData = await resposta.json().catch(() => ({ message: 'Erro ao atualizar movimentação. Verifique os dados e tente novamente.' }));
      throw new Error(errorData.message || 'Erro desconhecido ao atualizar movimentação.');
    }
    return await resposta.json(); // Assuming the backend returns the updated movimentacao
  } catch (erro) {
    console.error('Erro na API ao atualizar movimentação:', erro);
    throw erro;
  }
};


const fetchMovimentacoes = async () => {
  try {
    const resposta = await fetch('http://localhost:3000/movimentacoes/getMovimentacaoUsuarioTipo');
    if (!resposta.ok) {
      throw new Error('Erro ao buscar movimentações');
    }
    const dados = await resposta.json();
    return dados;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default function RelatorioMovimentacoes() {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for editing
  const [showEditModal, setShowEditModal] = useState(false);
  const [movimentacaoEmEdicao, setMovimentacaoEmEdicao] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    data_movimentacao: '',
    descricao: '',
    valor: '',
    tipo: 'entrada', // default type
    id_usuario: '', // Will be preserved from original object
    id_tipo_pagamento: '', // Will be preserved from original object
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [editError, setEditError] = useState(null);


  useEffect(() => {
    const carregarMovimentacoes = async () => {
      try {
        setLoading(true);
        setError(null);
        const dados = await fetchMovimentacoes();
        setMovimentacoes(dados);
      } catch (err) {
        console.error("Erro ao buscar movimentações:", err);
        setError("Não foi possível carregar as movimentações.");
      } finally {
        setLoading(false);
      }
    };

    carregarMovimentacoes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const execEditar = (movimentacao) => {
    setMovimentacaoEmEdicao(movimentacao);
    // Format date for input type="date" (YYYY-MM-DD)
    const formattedDate = movimentacao.data_movimentacao
      ? new Date(movimentacao.data_movimentacao).toISOString().split('T')[0]
      : '';

    setFormData({
      id: movimentacao.id,
      data_movimentacao: formattedDate,
      descricao: movimentacao.descricao,
      valor: movimentacao.valor.toString(), // Keep as string for form input
      tipo: movimentacao.tipo,
      usuario_id: movimentacao.usuario_id, // Preserve original IDs
      id_tipo_pagamento: movimentacao.id_tipo_pagamento, // Preserve original IDs
    });
    setEditError(null); // Clear previous edit errors
    setShowEditModal(true);
  };

  const handleSalvarEdicao = async (e) => {
    e.preventDefault(); // Prevent default form submission
    if (!movimentacaoEmEdicao) return;

    setIsUpdating(true);
    setEditError(null);

    try {
      // Construct payload for API - only send editable fields + necessary IDs
      const carregar = {
        descricao: formData.descricao,
        valor: parseFloat(formData.valor), // API expects number
        tipo: formData.tipo,
        data_movimentacao: formData.data_movimentacao, // Assuming API accepts YYYY-MM-DD
        usuario_id: formData.usuario_id, // Send original usuario_id
        id_tipo_pagamento: formData.id_tipo_pagamento, // Send original id_tipo_pagamento
      };

      const movimentacaoAtualizada = await atualizarMovimentacaoAPI(movimentacaoEmEdicao.id, carregar);

      // Update local state
      setMovimentacoes(prevMovimentacoes =>
        prevMovimentacoes.map(mov =>
          mov.id === movimentacaoAtualizada.id ? movimentacaoAtualizada : mov
        )
      );
      setShowEditModal(false);
      setMovimentacaoEmEdicao(null);
      window.location.reload();
    } catch (err) {
      console.error("Erro ao salvar edição:", err);
      setEditError(err.message || "Falha ao atualizar. Tente novamente.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelarEdicao = () => {
    setShowEditModal(false);
    setMovimentacaoEmEdicao(null);
    setEditError(null);
  };

  const execExcluir = async (idMovimentacao) => {
    if (window.confirm(`Tem certeza que deseja excluir a movimentação ID: ${idMovimentacao}?`)) {
      try {
        // --- INÍCIO: Lógica de Exclusão no Backend (Exemplo) ---
        const resposta = await fetch(`http://localhost:3000/movimentacoes/excluirMovimentacao/${idMovimentacao}`, {
            method: 'DELETE',
        });

        if (!resposta.ok) {
            const errorData = await resposta.json().catch(() => ({}));
            throw new Error(errorData.message || `Erro ao excluir movimentação ${idMovimentacao}`);
        }
        // --- FIM: Lógica de Exclusão no Backend ---

        setMovimentacoes(movimentacoes.filter(mov => mov.id !== idMovimentacao));
        alert(`Movimentação ID: ${idMovimentacao} excluída com sucesso.`);

      } catch (error) {
          console.error(`Erro ao excluir movimentação ID: ${idMovimentacao}`, error);
          alert(`Falha ao excluir movimentação: ${error.message}`);
      }
    }
  };


  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
        <p>Carregando movimentações...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (movimentacoes.length === 0 && !loading) {
    return (
      <div className="container mt-4">
        <div className="alert alert-info" role="alert">
          Nenhuma movimentação encontrada.
        </div>
      </div>
    );
  }

  return (
    <Corpo>
      <div className="container mt-5">
        <h2 className="mb-4 text-center" style={{ color: 'white' }}>Relatório de Movimentações</h2>
        <div className="table-responsive">
          <table className="table table-striped table-hover table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th className="text-end">Valor (R$)</th>
                <th>Tipo</th>
                <th>Usuário</th>
                <th>Tipo Pagamento</th>
                <th className="text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {movimentacoes.map((mov) => {
                const dataFormatada = new Date(mov.data_movimentacao).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
                return (
                  <tr key={mov.id} className={mov.tipo === 'saida' ? 'table-danger-subtle' : 'table-success-subtle'}>
                    <td>{dataFormatada !== 'Invalid Date' ? dataFormatada : 'Data Inválida'}</td>
                    <td>{mov.descricao}</td>
                    <td className={`text-end fw-bold ${mov.tipo === 'saida' ? 'text-danger' : 'text-success'}`}>
                      {mov.tipo === 'saida' ? '-' : '+'} {Number(mov.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td>
                      <span className={`badge ${mov.tipo === 'saida' ? 'bg-warning text-dark' : 'bg-success'}`}>
                        {mov.tipo.charAt(0).toUpperCase() + mov.tipo.slice(1)}
                      </span>
                    </td>
                    <td>{mov.nome}</td>
                    <td>{mov.nome_tipo_pagamento}</td>
                    <td className="text-center">
                      <button
                        title="Editar"
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => execEditar(mov)}
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button
                        title="Excluir"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => execExcluir(mov.id)}
                      >
                        <i className="bi bi-trash3-fill"></i>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
              
        {/* Modal de Edição Bootstrap */}
        {showEditModal && movimentacaoEmEdicao && (
          <div className="modal fade show" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} role="dialog">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <form onSubmit={handleSalvarEdicao}>
                  <div className="modal-header">
                    <h5 className="modal-title">Editar Movimentação (ID: {movimentacaoEmEdicao.id})</h5>
                    <button type="button" className="btn-close" onClick={handleCancelarEdicao} aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    {editError && <div className="alert alert-danger">{editError}</div>}
                    <div className="mb-3">
                      <label htmlFor="data_movimentacao" className="form-label">Data</label>
                      <input
                        type="date"
                        className="form-control"
                        id="data_movimentacao"
                        name="data_movimentacao"
                        value={formData.data_movimentacao}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="descricao" className="form-label">Descrição</label>
                      <input
                        type="text"
                        className="form-control"
                        id="descricao"
                        name="descricao"
                        value={formData.descricao}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="valor" className="form-label">Valor (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        id="valor"
                        name="valor"
                        value={formData.valor}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                      
                    <div className="mb-3">
                      <label htmlFor="tipo" className="form-label">Tipo</label>
                      <select
                        className="form-select"
                        id="tipo"
                        name="tipo"
                        value={formData.tipo}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="entrada">Entrada</option>
                        <option value="saida">Saída</option>
                      </select>
                    </div>
                    {/* Campos Usuário e Tipo Pagamento não são editáveis neste formulário simples,
                        mas seus IDs (usuario_id, tipo_pagamento_id) são preservados em formData
                        e enviados na atualização se o backend os requer.
                        Se precisar editar Usuário/Tipo Pagamento, seriam necessários dropdowns
                        populados com dados do backend.
                    */}
                  </div>
                  
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={handleCancelarEdicao} disabled={isUpdating}>
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={isUpdating}>
                      {isUpdating ? (
                        <>
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          Salvando...
                        </>
                      ) : (
                        'Salvar Alterações'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </Corpo>
  );
}