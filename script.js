// Função para salvar a tabela no localStorage
function salvarDados() {
    const tabela = document.getElementById('tabelaContas');
    const dados = [];
  
    // Itera pelas linhas da tabela e coleta os dados
    for (let i = 1; i < tabela.rows.length; i++) {
      let row = tabela.rows[i];
      let rowData = [];
      for (let j = 0; j < row.cells.length; j++) {
        rowData.push(row.cells[j].textContent);
      }
      dados.push(rowData);
    }
  
    // Salva os dados no localStorage
    localStorage.setItem('contasAPagar', JSON.stringify(dados));
    alert("Dados salvos com sucesso!");
  }
  
  // Função para carregar os dados do localStorage
  function carregarDados() {
    const dadosSalvos = localStorage.getItem('contasAPagar');
    if (dadosSalvos) {
      const dados = JSON.parse(dadosSalvos);
  
      // Adiciona os dados salvos à tabela
      const tabela = document.getElementById('tabelaContas').getElementsByTagName('tbody')[0];
      dados.forEach(dado => {
        const novaLinha = tabela.insertRow();
        dado.forEach(celula => {
          const novaCelula = novaLinha.insertCell();
          novaCelula.textContent = celula;
        });
      });
    }
  }
  
  // Função para validar o formulário
  function validarFormulario() {
    const fornecedor = document.getElementById('fornecedor').value;
    const formaPagamento = document.getElementById('formaPagamento').value;
    const valor = document.getElementById('valor').value;
    const vencimento = document.getElementById('vencimento').value;
  
    if (!fornecedor || !formaPagamento || !valor || !vencimento) {
      alert("Por favor, preencha todos os campos.");
      return false;
    }
  
    // Caso os campos sejam válidos, chama a função para adicionar a conta
    adicionarConta(fornecedor, formaPagamento, valor, vencimento);
    return false;
  }
  
  // Função para adicionar os dados à tabela
  function adicionarConta(fornecedor, formaPagamento, valor, vencimento) {
    const tabela = document.getElementById('tabelaContas').getElementsByTagName('tbody')[0];
  
    // Criar uma nova linha
    const novaLinha = tabela.insertRow();
  
    // Adicionar células à linha
    const celulaFornecedor = novaLinha.insertCell(0);
    const celulaFormaPagamento = novaLinha.insertCell(1);
    const celulaValor = novaLinha.insertCell(2);
    const celulaVencimento = novaLinha.insertCell(3);
  
    // Preencher as células com os valores
    celulaFornecedor.textContent = fornecedor;
    celulaFormaPagamento.textContent = formaPagamento;
    celulaValor.textContent = `R$ ${parseFloat(valor).toFixed(2)}`;
    celulaVencimento.textContent = vencimento;
  
    // Limpar o formulário após o cadastro
    document.getElementById('formCadastro').reset();
  }
  
  // Função para exportar dados para CSV
  function exportarCSV() {
    const tabela = document.getElementById('tabelaContas');
    let csvContent = "Fornecedor,Forma de Pagamento,Valor,Data de Vencimento\n";
  
    for (let i = 1; i < tabela.rows.length; i++) {
      let row = tabela.rows[i];
      let rowData = [];
      for (let j = 0; j < row.cells.length; j++) {
        rowData.push(row.cells[j].textContent);
      }
      csvContent += rowData.join(",") + "\n";
    }
  
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'contas_a_pagar.csv';
    link.click();
  }
  
  // Função para gerar o PDF
  function gerarPDF() {
    const doc = new jsPDF();
    const tabela = document.getElementById('tabelaContas');
    let tabelaTexto = '';
  
    tabelaTexto += 'Fornecedor | Forma de Pagamento | Valor | Data de Vencimento\n';
    tabelaTexto += '-----------------------------------------------\n';
  
    for (let i = 1; i < tabela.rows.length; i++) {
      let row = tabela.rows[i];
      let rowData = [];
      for (let j = 0; j < row.cells.length; j++) {
        rowData.push(row.cells[j].textContent);
      }
      tabelaTexto += rowData.join(' | ') + '\n';
    }
  
    doc.text(tabelaTexto, 10, 10);
    doc.save('contas_a_pagar.pdf');
  }
  
  // Carregar os dados salvos ao abrir a página
  document.addEventListener('DOMContentLoaded', carregarDados);
  