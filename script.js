// Token de autenticação (NÃO exponha em um site público; use apenas para testes locais)
const GITHUB_TOKEN = "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";
const REPO_OWNER = "gustavo-021";
const REPO_NAME = "CONTROLE-DE-CONTAS2";
const FILE_PATH = "dados.json";

const tabela = document.getElementById('tabelaContas').querySelector('tbody');
const form = document.getElementById('formCadastro');

let contas = []; // Lista de contas cadastradas

// Carregar os dados salvos ao abrir a página
document.addEventListener('DOMContentLoaded', () => {
  carregarDados();
});

// Função para salvar a tabela no localStorage
function salvarDados() {
  localStorage.setItem('contasAPagar', JSON.stringify(contas));
  alert("Dados salvos com sucesso!");
}

// Função para carregar os dados do localStorage
function carregarDados() {
  const dadosSalvos = localStorage.getItem('contasAPagar');
  if (dadosSalvos) {
    contas = JSON.parse(dadosSalvos);
    atualizarTabela();
  }
}

// Atualizar a tabela com os dados em "contas"
function atualizarTabela() {
  tabela.innerHTML = contas
    .map(
      (conta) => `
    <tr>
      <td>${conta.fornecedor}</td>
      <td>${conta.formaPagamento}</td>
      <td>${conta.valor}</td>
      <td>${conta.vencimento}</td>
    </tr>
  `
    )
    .join("");
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

  adicionarConta(fornecedor, formaPagamento, valor, vencimento);
  return false;
}

// Função para adicionar os dados à tabela e ao array "contas"
function adicionarConta(fornecedor, formaPagamento, valor, vencimento) {
  const novaConta = {
    fornecedor,
    formaPagamento,
    valor: `R$ ${parseFloat(valor).toFixed(2)}`,
    vencimento,
  };

  contas.push(novaConta);
  atualizarTabela();

  // Limpar o formulário após o cadastro
  form.reset();
}

// Função para exportar dados para CSV
function exportarCSV() {
  let csvContent = "Fornecedor,Forma de Pagamento,Valor,Data de Vencimento\n";

  contas.forEach((conta) => {
    csvContent += `${conta.fornecedor},${conta.formaPagamento},${conta.valor},${conta.vencimento}\n`;
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'contas_a_pagar.csv';
  link.click();
}

// Função para gerar o PDF
function gerarPDF() {
  const doc = new jsPDF();
  let tabelaTexto = '';

  tabelaTexto += 'Fornecedor | Forma de Pagamento | Valor | Data de Vencimento\n';
  tabelaTexto += '-------------------------------------------------------\n';

  contas.forEach((conta) => {
    tabelaTexto += `${conta.fornecedor} | ${conta.formaPagamento} | ${conta.valor} | ${conta.vencimento}\n`;
  });

  doc.text(tabelaTexto, 10, 10);
  doc.save('contas_a_pagar.pdf');
}

// Função para salvar os dados no GitHub
async function salvarNoGitHub() {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
  const content = btoa(JSON.stringify(contas, null, 2));

  try {
    // Verificar se o arquivo já existe
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      },
    });

    const { sha } = response.ok ? await response.json() : { sha: null };

    // Salvar/Atualizar o arquivo
    const saveResponse = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Atualizando dados de contas",
        content: content,
        sha: sha, // Necessário para atualizar arquivos existentes
      }),
    });

    if (saveResponse.ok) {
      alert("Dados salvos no GitHub com sucesso!");
    } else {
      throw new Error("Erro ao salvar dados no GitHub");
    }
  } catch (error) {
    console.error(error);
    alert("Falha ao salvar os dados no GitHub.");
  }
}
