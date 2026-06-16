let chamados =
JSON.parse(localStorage.getItem("chamados")) || [];

function login(){

    const usuario =
    document.getElementById("usuario").value;

    const senha =
    document.getElementById("senha").value;

    if(usuario === "admin" && senha === "1234"){

        document.getElementById("login").style.display = "none";
        document.getElementById("sistema").style.display = "block";

        carregarChamados();

    }else{

        alert("Usuário ou senha inválidos");
    }
}

function alternarTema(){
    document.body.classList.toggle("dark");
}

function criarChamado(){

    const titulo =
    document.getElementById("titulo").value;

    const descricao =
    document.getElementById("descricao").value;

    const prioridade =
    document.getElementById("prioridade").value;

    if(!titulo || !descricao){

        alert("Preencha todos os campos");
        return;
    }

    const chamado = {

        id: Date.now(),
        titulo,
        descricao,
        prioridade,
        status: "Aberto"

    };

    chamados.push(chamado);

    salvarDados();

    document.getElementById("titulo").value = "";
    document.getElementById("descricao").value = "";

    carregarChamados();
}

function salvarDados(){

    localStorage.setItem(
        "chamados",
        JSON.stringify(chamados)
    );
}

function excluirChamado(id){

    chamados =
    chamados.filter(
        chamado => chamado.id !== id
    );

    salvarDados();
    carregarChamados();
}

function alterarStatus(id){

    const chamado =
    chamados.find(
        chamado => chamado.id === id
    );

    if(chamado.status === "Aberto"){

        chamado.status = "Em Atendimento";

    }else if(chamado.status === "Em Atendimento"){

        chamado.status = "Resolvido";
    }

    salvarDados();
    carregarChamados();
}

function carregarChamados(){

    renderizarChamados(chamados);
    atualizarDashboard();
}

function renderizarChamados(lista){

    const container =
    document.getElementById("listaChamados");

    container.innerHTML = "";

    lista.forEach(chamado => {

        container.innerHTML += `

        <div class="chamado">

            <h3>${chamado.titulo}</h3>

            <p>${chamado.descricao}</p>

            <p><strong>Prioridade:</strong> ${chamado.prioridade}</p>

            <p><strong>Status:</strong> ${chamado.status}</p>

            <div class="acoes">

                <button
                class="btn-primary"
                onclick="alterarStatus(${chamado.id})">
                Alterar Status
                </button>

                <button
                class="btn-danger"
                onclick="excluirChamado(${chamado.id})">
                Excluir
                </button>

            </div>

        </div>
        `;
    });
}

function pesquisarChamado(){

    const texto =
    document
    .getElementById("pesquisa")
    .value
    .toLowerCase();

    const resultado =
    chamados.filter(chamado =>
        chamado.titulo
        .toLowerCase()
        .includes(texto)
    );

    renderizarChamados(resultado);
}

function atualizarDashboard(){

    document.getElementById("total").textContent =
    chamados.length;

    document.getElementById("alta").textContent =
    chamados.filter(
        c => c.prioridade === "Alta"
    ).length;

    document.getElementById("resolvidos").textContent =
    chamados.filter(
        c => c.status === "Resolvido"
    ).length;
}

function gerarPDF(){

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    doc.text(
        "Relatório de Chamados",
        10,
        10
    );

    let linha = 20;

    chamados.forEach(chamado => {

        doc.text(
            `${chamado.titulo} - ${chamado.status}`,
            10,
            linha
        );

        linha += 10;
    });

    doc.save("relatorio_chamados.pdf");
}