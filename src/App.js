import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import Login from './componentes/pages/Login';
import Registrar from './componentes/pages/Register';
import Dashboard from './componentes/pages/dashboard';
import AddMovimentacoes from './componentes/pages/Movimentacoes/Adicionar';
import RelatorioMovimentacoes from './componentes/pages/Movimentacoes/Relatorio';

function App() {
  return (
   <Router>
      <Routes>
        <Route path="/" element={<Login titulo="login"/>} />
        <Route path="/registrar" element={<Registrar titulo="Cadastrar" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/adicionarmovimentacao" element={<AddMovimentacoes />} />
        <Route path="/relatoriomovimentacao" element={<RelatorioMovimentacoes />} />
      </Routes>
   </Router>  
   );
}

export default App;
