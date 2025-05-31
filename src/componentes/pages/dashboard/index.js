import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';
import { Link } from "react-router-dom"; // Importe useNavigate para redirecionamento (opcional)

const Corpo = styled.div`
    background-color: #2A83F0;
    padding: 10px;
    width: 100vw; // Garante que o corpo ocupe toda a altura da viewport
    min-height: 100vh;
    display: flex; // Necessário para centralizar o conteúdo com o wrapper abaixo
`;


const fetchMovimentacoes = async () => {
  try {
    const resposta = await fetch('http://localhost:3000/movimentacoes/getMovimentacaoUsuarioTipo');
    if (!resposta.ok) {
      throw new Error('Erro ao buscar movimentações');
    }
    const dados = await resposta.json();
    return dados;
  } catch (erro) {
    console.erro(erro);
    throw erro;
  }
};

export default function Dashboard() {
    const [startDate, setStartDate] = useState(new Date());
    const [movimentacoes, setMovimentacoes] = useState([]);
    const [totalEntradas, setTotalEntradas] = useState(0);
    const [totalSaidas, setTotalSaidas] = useState(0);
    const [data, setData] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
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

    useEffect(() => {
      let entradas = 0;
      let saidas = 0;

    movimentacoes.forEach((mov) => {
      if (mov.tipo === 'entrada') {
        entradas += Number(mov.valor); // Certifique-se de que 'valor' é um número
        setTotalEntradas(entradas);
      } else if (mov.tipo === 'saida') {
        saidas += Number(mov.valor); // Certifique-se de que 'valor' é um número
        setTotalSaidas(saidas);
      }
    });

  setTotalEntradas(entradas);
  setTotalSaidas(saidas);

}, [movimentacoes]);
  
  return (
    <Corpo>
      <div className="container">
        <div className="row">
          
          {/* Conteúdo Principal */}
          <main>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
              <h1 className="h2" style={{color: 'white'}}>Dashboard</h1>
              <div className="btn-toolbar mb-2 mb-md-0">
              <div class="dropdown" style={{marginRight: '10px'}}>
                <button class="btn btn-warning dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                Movimentações
                </button>
                <ul class="dropdown-menu">
                  <li><Link class="dropdown-item" to="/adicionarmovimentacao">Adicionar</Link></li>
                  <li><Link class="dropdown-item" to="/relatoriomovimentacao">Relatório</Link></li>
                </ul>
              </div>
                {/* <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  showWeekNumbers
                  calendar
                  dateFormat="dd/MM/yyyy"
                  locale={ptBR}
                  className='form-control'
                  /> */}
                  <input
                          type="date"
                          id="dataMovimentacao"
                          value={data}
                          onChange={(e) => setData(e.target.value)}
                          required
                      />
                {/* Até aqui */}
              </div>
            </div>

            {/* Seções do Dashboard */}
            <div className="row">
              <div className="col-md-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Total de Entradas</h5>
                    <p className="card-text">R$ {totalEntradas},00</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Total de Saídas</h5>
                    <p className="card-text">R$ {totalSaidas},00</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">O que sobrou</h5>
                    <p className="card-text">R$ {totalEntradas - totalSaidas},00</p>
                  </div>
                </div>
              </div>
            </div>

            <h2 style={{color: 'white'}}>Relatório</h2>
            <div className="table-responsive">
              <table className="table table-striped table-sm">
                <thead>
                  <tr>
                    <th scope="col">Data</th>
                    <th scope="col">Movimentação</th>
                    <th scope="col">Descrição</th>
                    <th scope="col">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {movimentacoes.map((mov) => {
                const dataFormatada = new Date(mov.data_movimentacao).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
                return (
                  <tr key={mov.id} className={mov.tipo === 'saida' ? 'table-danger-subtle' : 'table-success-subtle'}>
                    <td>{dataFormatada !== 'Invalid Date' ? dataFormatada : 'Data Inválida'}</td>
                    <td>{mov.descricao}</td>
                    <td className={`text-start fw-bold ${mov.tipo === 'saida' ? 'text-danger' : 'text-success'}`}>
                      {mov.tipo === 'saida' ? '-' : '+'} {Number(mov.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td>
                      <span className={`badge ${mov.tipo === 'saida' ? 'bg-warning text-dark' : 'bg-success'}`}>
                        {mov.tipo.charAt(0).toUpperCase() + mov.tipo.slice(1)}
                      </span>
                    </td>
                  </tr>
                );
              })}
              </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>
    </Corpo>
  );
}
