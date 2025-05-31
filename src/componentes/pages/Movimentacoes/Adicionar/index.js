import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';

const Corpo = styled.div`
    background-color: #2A83F0;
    padding: 10px;
    width: 100vw; // Garante que o corpo ocupe toda a altura da viewport
    min-height: 100vh;
    display: flex; // Necessário para centralizar o conteúdo com o wrapper abaixo
`;

export default function AdicionarMovimenacao() {

    const [descricao, setDescricao] = useState('');
    const [valor, setValor] = useState('');
    const [tipo, setTipo] = useState('entrada'); // Valor padrão
    const [id_usuario, setIdUsuario] = useState('');
    const [usuarios, setUsuarios] = useState([]);//armazenar os usuarios
    const [id_tipo_pagamento, setIdTipoPagamento] = useState('');
    const [tipoPagamentos, setTipoPagamentos] = useState([]);
    const [error, setError] = useState(''); // Estado para mensagens de erro da API
    const [loading, setLoading] = useState(false); // Estado para feedback de carre
    const [data_movimentacao, setDataMovimentacao] = useState(new Date().toISOString().split('T')[0]);

    const navigate = useNavigate();

    // Efeito para buscar usuários quando o componente montar
    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                // Substitua pela URL correta da sua API de usuários
                const response = await fetch('http://localhost:3000/usuarios/getTodosUsuarios');
                if (!response.ok) {
                    throw new Error('Falha ao buscar usuários');
                }
                const data = await response.json();
                setUsuarios(data); // Armazena os usuários no estado
                if (data.length > 0) {
                    // Opcional: definir um usuário padrão ou deixar "Selecione o usuário"
                    // setIdUsuario(data[0].id); // Exemplo: define o primeiro usuário como padrão
                }
            } catch (err) {
                console.error("Erro ao buscar usuários:", err);
                setError('Não foi possível carregar a lista de usuários.');
            }
        };

        fetchUsuarios();
    }, []); // Array de dependências vazio para executar apenas uma vez na montagem

    // Efeito para buscar usuários quando o componente montar
    useEffect(() => {
        const fetchPagamentos = async () => {
            try {
                // Substitua pela URL correta da sua API de usuários
                const response = await fetch('http://localhost:3000/movimentacoes/getTipoPagamento');
                if (!response.ok) {
                    throw new Error('Falha ao buscar tipos de pagamento');
                }
                const data = await response.json();
                setTipoPagamentos(data); // Armazena os tipos no estado
                if (data.length > 0) {
                    // Opcional: definir um usuário padrão ou deixar "Selecione o usuário"
                    // setIdUsuario(data[0].id); // Exemplo: define o primeiro usuário como padrão
                }
            } catch (err) {
                console.error("Erro ao buscar tipos de pagamento:", err);
                setError('Não foi possível buscar os tipos de pagamento.');
            }
        };

        fetchPagamentos();
    }, []); // Array de dependências vazio para executar apenas uma vez na montagem

    
    // Função para lidar com o envio do formulário
    const execSubmit = async (event) => {
       
            // alert(senha);
            event.preventDefault(); // Previne o recarregamento padrão da página
            setLoading(true); // Inicia o feedback de carregamento
            setError(''); // Limpa erros anteriores
    
            try {
                const response = await fetch('http://localhost:3000/movimentacoes/adicionar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ descricao, valor, tipo, data_movimentacao, id_usuario, id_tipo_pagamento }), // Envia os dados como JSON
                });
                console.log(response.toString);
    
                const data = await response.json(); // Lê a resposta como JSON
    
                if (response.ok) {
                    // Sucesso no cadastro
                    alert('Cadastro bem-sucedido!'); // Ou uma notificação melhor
                    console.log('Dados da API:', data);
                    // Aqui você pode, por exemplo, salvar um token de autenticação
                    // localStorage.setItem('authToken', data.token);
                    // E redirecionar o usuário para a página principal ou dashboard
                    navigate('/'); 
                } else {
                    // Erro no login (ex: credenciais inválidas, servidor fora)
                    setError(data.message || 'Erro ao fazer o cadastro. Tente novamente.');
                }
            } catch (error) {
                // Erro na requisição (ex: problema de rede)
                console.error('Falha ao conectar com a API:', error);
                setError('Não foi possível conectar ao servidor. Verifique sua conexão.');
            } finally {
                setLoading(false); // Finaliza o feedback de carregamento
            }
        }

      
    
  
    return (
      <Corpo>
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="card shadow-sm">
                <div className="card-body p-4">
                  <h2 className="card-title text-center mb-4" style={{color:'#2A83F0'}}>Adicionar Nova Movimentação</h2>
                  <form onSubmit={execSubmit}>
                    {/* Campo Descrição */}
                    <div className="mb-3">
                      <label htmlFor="descricao" className="form-label">
                        Descrição
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="descricao"
                        // value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        required
                      />
                    </div>
    
                    {/* Campo Valor */}
                    <div className="mb-3">
                      <label htmlFor="valor" className="form-label">
                        Valor (R$)
                      </label>
                      <input
                        type="number"
                        step="0.01" // Permite centavos
                        className="form-control"
                        id="valor"
                        // value={valor}
                        onChange={(e) => setValor(e.target.value)}
                        required
                        placeholder="Ex: 150.75"
                      />
                    </div>
    
                    {/* Campo Tipo (Entrada/Saída) */}
                    <div className="mb-3">
                      <label htmlFor="tipo" className="form-label">
                        Tipo
                      </label>
                      <select
                        className="form-select"
                        id="tipo"
                        // value={tipo}
                        onChange={(e) => setTipo(e.target.value)}
                        required
                      >
                        <option value="selecione">Selecione o Tipo</option>
                        <option value="entrada">Entrada</option>
                        <option value="saida">Saída</option>
                        {/* Adicione outras opções se necessário */}
                      </select>
                    </div>
    
                  {/* Campo Usuário (Dropdown) */}
                  <div className="mb-3">
                      <label htmlFor="id_usuario" className="form-label">Usuário</label>
                      <select
                          className="form-select"
                          id="id_usuario"
                          value={id_usuario} // Controla o valor selecionado
                          onChange={(e) => setIdUsuario(e.target.value)} // Atualiza o estado com o ID do usuário
                          required>                
                            <option value="">
                              Selecione o usuário
                            </option>
                            {/* Mapeia a lista de usuários para criar as opções */}
                            {usuarios.map(usuario => (
                            <option key={usuario.id} value={usuario.id}>
                            {usuario.nome} {/* Exibe o nome do usuário */}
                            </option>))}
                        </select>
                  </div>  

                  {/* Campo Data da Movimentação */}
                  <div className="mb-3">
                      <label htmlFor="dataMovimentacao" className="form-label">Data da Movimentação</label>
                      <input
                          type="date"
                          className="form-control"
                          id="dataMovimentacao"
                          value={data_movimentacao}
                          onChange={(e) => setDataMovimentacao(e.target.value)}
                          required
                      />
                  </div>              

                  {/* Campo Tipo de Pagamento (Dropdown) */}
                  <div className="mb-3">
                      <label htmlFor="idTipoPagamento" className="form-label">Tipo de Pagamento</label> {/* Corrigido */}
                      <select
                          className="form-select"
                          id="id_tipo_pagamento" // Corrigido
                          value={id_tipo_pagamento}
                          onChange={(e) => setIdTipoPagamento(e.target.value)}
                          required
                      >
                          <option value="">
                              Selecione o tipo de Pagamento
                          </option>
                          {/* Verifica se tipoPagamentos é um array antes de mapear */}
                          {Array.isArray(tipoPagamentos) && tipoPagamentos.map(tipo => (
                          <option key={tipo.id_tipo_pagamento} value={tipo.id_tipo_pagamento}>
                              {tipo.nome_tipo_pagamento}
                          </option>))}
                      </select>
                  </div>

                  {/* Exibe mensagem de erro, se houver */}
                  {error && <div className="alert alert-danger" role="alert">{error}</div>}
    
                    {/* Botão de Envio */}
                    <div className="d-grid">
                      <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Cadastrando...' : 'Salvar'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Corpo>
    );
}