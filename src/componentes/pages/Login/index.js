import React, { useState } from 'react'; // Importe useState
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from "react-router-dom"; // Importe useNavigate para redirecionamento (opcional)
import styled from 'styled-components';
import ImagemInicial from '../../../img/imagem-inicial.png';

// Styled component for the form container - removed border and width
const LoginFormContainer = styled.div`
    padding: 20px;
`;

const Corpo = styled.div`
    background-color: #2A83F0;
    min-height: 100vh; // Garante que o corpo ocupe toda a altura da viewport
    display: flex; // Necessário para centralizar o conteúdo com o wrapper abaixo
`;

export default function Login({ titulo }) {
    // Estados para o email e senha
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState(''); // Estado para mensagens de erro da API
    const [loading, setLoading] = useState(false); // Estado para feedback de carregamento

    const navigate = useNavigate(); // Hook para redirecionar após o login (opcional)

    // Função para lidar com a submissão do formulário
    const execSubmit = async (event) => {
        event.preventDefault(); // Previne o recarregamento padrão da página
        setLoading(true); // Inicia o feedback de carregamento
        setError(''); // Limpa erros anteriores

        try {
            const response = await fetch('https://controlefinanceiro2025be-production.up.railway.app/usuarios/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, senha }), // Envia os dados como JSON
            });

            const data = await response.json(); // Lê a resposta como JSON

            if (response.ok) {
                // Sucesso no login
                alert('Login bem-sucedido!'); // Ou uma notificação melhor
                console.log('Dados da API:', data);
                // Aqui você pode, por exemplo, salvar um token de autenticação
                // localStorage.setItem('authToken', data.token);
                // E redirecionar o usuário para a página principal ou dashboard
                navigate('/dashboard'); // Exemplo de redirecionamento para a home
            } else {
                // Erro no login (ex: credenciais inválidas, servidor fora)
                setError(data.message || 'Erro2222 ao fazer login. Tente novamente.');
            }
        } catch (error) {
            // Erro na requisição (ex: problema de rede)
            console.error('Falha ao conectar com a API:', error);
            setError('Não foi possível conectar ao servidor. Verifique sua conexão.');
        } finally {
            setLoading(false); // Finaliza o feedback de carregamento
        }
    };

    return (
        <Corpo>
            <div className="d-flex align-items-center justify-content-center vh-100 w-100"> {/* Adicionado w-100 para ocupar largura total */}
                <div className="container">
                    <div className="row justify-content-center align-items-center">
                        <div className="col-12 col-md-6 text-center d-none d-md-block">
                            <img
                                src={ImagemInicial}
                                alt="Imagem Inicial"
                                className="img-fluid"
                                style={{ maxWidth: '100%', height: 'auto', borderRadius: '20px' }}
                            />
                        </div>
                        <div className="col-12 col-md-6">
                            <LoginFormContainer>
                                <h1 className="text-center mb-4" style={{ color: 'white' }}>{titulo}</h1>
                                {/* Adiciona o evento onSubmit ao formulário */}
                                <form onSubmit={execSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label" style={{ color: 'white' }}>E-mail</label>
                                        <input
                                            type="email" // Mudado para type="email" para validação básica
                                            className="form-control"
                                            id="email"
                                            placeholder="Insira o e-mail"
                                            value={email} // Controla o valor do input
                                            onChange={(e) => setEmail(e.target.value)} // Atualiza o estado ao digitar
                                            required // Campo obrigatório
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="senha" className="form-label" style={{ color: 'white' }}>Senha</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="senha"
                                            placeholder="Insira sua senha"
                                            value={senha} // Controla o valor do input
                                            onChange={(e) => setSenha(e.target.value)} // Atualiza o estado ao digitar
                                            required // Campo obrigatório
                                        />
                                    </div>

                                    {/* Exibe mensagem de erro, se houver */}
                                    {error && <div className="alert alert-danger" role="alert">{error}</div>}

                                    <div className="d-grid gap-2">
                                        {/* Botão de Login agora é do tipo submit */}
                                        <button type="submit" className="btn btn-primary" disabled={loading}>
                                            {loading ? 'Entrando...' : 'Login'}
                                        </button>
                                        <Link to="/registrar" className="link text-center mt-2" style={{ color: 'white' }}>cadastre-se</Link>
                                    </div>
                                </form>
                            </LoginFormContainer>
                        </div>
                    </div>
                </div>
            </div>
        </Corpo>
    );
}