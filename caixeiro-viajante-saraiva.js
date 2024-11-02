const numeroCaminhos = 500; // Número de rotas geradas em cada geração
const chanceMutacao = 0.01; // Chance de mutação em cada indivíduo
const maximoGeracoes = 10000; // Número máximo de gerações a serem simuladas
const objetivoDistancia = 39; // Distância mínima desejada para finalizar o algoritmo

let cidades = [
    [7, 5],
    [10, 2],
    [10, -2],
    [7, -4],
    [5, -6],
    [0, -7],
    [-2, -6],
    [-3, -2],
]; // Lista de cidades como coordenadas (x, y)

// Calcula a distância entre duas cidades
// SARAIVA: CRIAR INDIVIDUO 
function calculoDistanciaEntrePontos(cidadeA, cidadeB) {
    return Math.sqrt(Math.pow((cidadeB[0] - cidadeA[0]), 2) + Math.pow((cidadeB[1] - cidadeA[1]), 2));
}

// Calcula a distância total de uma rota
function calcularDistanciaTotal(individuo) {
    let distancia = 0;
    for (let i = 0; i < individuo.length - 1; i++) {
        distancia += calculoDistanciaEntrePontos(individuo[i], individuo[i + 1]);
    }
    distancia += calculoDistanciaEntrePontos(individuo[individuo.length - 1], individuo[0]);
    return distancia;
}

// Gera um caminho aleatório (indivíduo) percorrendo todas as cidades
function criarIndividuo() {
    const individuo = [...cidades];
    for (let cidadeIndice = individuo.length - 1; cidadeIndice > 0; cidadeIndice--) {
        const cidadeAleatoriaIndice = Math.floor(Math.random() * (cidadeIndice + 1));
        [individuo[cidadeIndice], individuo[cidadeAleatoriaIndice]] = [individuo[cidadeAleatoriaIndice], individuo[cidadeIndice]]; // Embaralha as cidades
    }
    return individuo;
}

// Cria uma nova população inicial de rotas
function criarpopulacao(tamanho) {
    const populacao = [];
    for (let i = 0; i < tamanho; i++) {
        populacao.push(criarIndividuo());
    }
    return populacao;
}

function aptidao(individuo) {
    const distancia = calcularDistanciaTotal(individuo);

    if (distancia > 0) {
        return 1 / distancia;
    } else {
        return 1000;
    }
}


// Seleção - escolhe indivíduos mais aptos para cruzamento
function selecao(populacao) {
    const selecionados = [];
    populacao.forEach(individuo => {
        const pontos = aptidao(individuo) * 100; // Multiplica aptidão para probabilidade maior de seleção
        for (let i = 0; i < pontos; i++) {
            selecionados.push(individuo);
        }
    });
    return [escolhaAleatoria(selecionados), escolhaAleatoria(selecionados)]; // Seleciona dois indivíduos
}

// Função de cruzamento - cria um novo caminho a partir de dois pais
function cruzarCaminhos(rota1, rota2) {
    const comprimento = rota1.length;

    // Define pontos de início e fim para a seção que será copiada
    const inicio = Math.floor(Math.random() * comprimento);
    const fim = inicio + Math.floor(Math.random() * (comprimento - inicio));

    // Começa o filho com uma parte da rota1 entre 'inicio' e 'fim'
    const filho = rota1.slice(inicio, fim);

    // Adiciona as cidades da rota2, mantendo a ordem e nãoo deixando duplicatas
    for (let cidade of rota2) {
        if (!filho.includes(cidade)) { // Verifica se a cidade já está no filho
            filho.push(cidade); // Adiciona a cidade se ela ainda não está
        }
    }

    return filho;
}


// Mutação - altera aleatoriamente a posição de uma cidade no caminho
function mutacao(individuo) {
    const individuoMutante = [...individuo];
    for (let i = 0; i < individuoMutante.length; i++) {
        if (Math.random() < chanceMutacao) {
            const indiceAleatorio = Math.floor(Math.random() * individuoMutante.length);
            // Troca duas cidades de lugar
            [individuoMutante[i], individuoMutante[indiceAleatorio]] = [individuoMutante[indiceAleatorio], individuoMutante[i]];
        }
    }
    return individuoMutante; // Retorna o caminho com possíveis mutações
}

// Função auxiliar para selecionar um elemento aleatório de um array
function escolhaAleatoria(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Função principal do algoritmo genético
function algoritmoGenetico() {
    let populacao = criarpopulacao(numeroCaminhos);
    console.log(populacao);
    

    for (let geracao = 0; geracao < maximoGeracoes; geracao++) {
        populacao.sort((a, b) => aptidao(b) - aptidao(a)); // Ordena pela aptidão (do melhor para o pior)
        
        
        const melhorindividuo = populacao[0];

        // Adiciona a primeira cidade ao final para que o caminho termine na cidade inicial
        if (melhorindividuo[0] !== melhorindividuo[melhorindividuo.length - 1]) {
            melhorindividuo.push(melhorindividuo[0]);
        }

        const melhorDistancia  = 1 / aptidao(melhorindividuo); // Calcula a menor distância para o melhor caminho
        
        // Verifica se o objetivo foi alcançado
        if (melhorDistancia  <= objetivoDistancia) {
            console.log(`Geração ${geracao}, Melhor Distância: ${melhorDistancia .toFixed(2)}`);
            console.log("Solução encontrada com a distância mínima desejada!");
            console.log("Melhor Caminho: ", melhorindividuo);
            break;
        } else {
            console.log(`Geração ${geracao}, Sua distância: ${melhorDistancia .toFixed(2)}, Seu caminho atual: `); 
            console.log(melhorindividuo)
        }
        
         // Cria nova população com elitismo (mantém o melhor caminho)
         const novopopulacao = [];


        while (novopopulacao.length < numeroCaminhos) {
            const [individuo1, individuo2] = selecao(populacao); // Seleciona dois pais
            let filho = cruzarCaminhos(individuo1, individuo2); // Realiza o cruzamento
            filho = mutacao(filho); // Aplica mutação
            novopopulacao.push(filho); // Adiciona novo caminho à nova população
        }

        populacao = novopopulacao; // Atualiza a população para a próxima geração
    }
}

// Executa o algoritmo genético
algoritmoGenetico();