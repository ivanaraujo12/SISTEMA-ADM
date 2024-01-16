

var menuItem = document.querySelectorAll('.item-menu')

function selectLink(){
    menuItem.forEach((item)=>
        item.classList.remove('ativo')
    )
    this.classList.add('ativo')
}


menuItem.forEach((item)=>
    item.addEventListener('click', selectLink)
)


//Expandir o menu 

var btnExp = document.querySelector('#btn-exp')
var menuSite = document.querySelector('.menu-lateral')

btnExp.addEventListener('click', function(){
    menuSite.classList.toggle('expandir')
})


async function fetchItems() {
  try {
    const response = await fetch('http://localhost:3333/financeiro');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar itens:', error);
    return [];
  }
}

// Função para carregar os itens
async function loadItens() {
  items = await fetchItems();
  tbody.innerHTML = "";
  items.forEach((item, index) => {
    insertItem(item, index);
  });

  getTotals();
}


// Função para deletar um item da API
async function deleteItem(id) {
  try {
    const response = await fetch(`http://localhost:3333/financeiro/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Erro ao deletar o item');
    }

    // Recarrega os itens após a deleção
    loadItens();
  } catch (error) {
    console.error('Erro ao deletar o item:', error);
  }
}

// Função para inserir um item na tabela
function insertItem(item, index) {
  let tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${item.description}</td>
    <td>R$ ${item.value.toFixed(2)}</td>
    <td class="columnType">${
      item.stock === "ENTRADA"
        ? '<i class="bx bxs-chevron-up-circle"></i>'
        : '<i class="bx bxs-chevron-down-circle"></i>'
    }</td>
    <td class="columnAction">
      <button onclick="deleteItem(${item.id})"><i class='bx bx-trash'></i></button>
    </td>
  `;

  tbody.appendChild(tr);
}

function getTotals() {
  const amountIncomes = items
    .filter((item) => item.type === "Entrada")
    .map((transaction) => Number(transaction.amount));

  const amountExpenses = items
    .filter((item) => item.type === "Saída")
    .map((transaction) => Number(transaction.amount));

  const totalIncomes = amountIncomes
    .reduce((acc, cur) => acc + cur, 0)
    .toFixed(2);

  const totalExpenses = Math.abs(
    amountExpenses.reduce((acc, cur) => acc + cur, 0)
  ).toFixed(2);

  const totalItems = (totalIncomes - totalExpenses).toFixed(2);

  incomes.innerHTML = totalIncomes;
  expenses.innerHTML = totalExpenses;
  total.innerHTML = totalItems;
}

const getItensBD = () => JSON.parse(localStorage.getItem("db_items")) ?? [];
const setItensBD = () =>
  localStorage.setItem("db_items", JSON.stringify(items));

loadItens();