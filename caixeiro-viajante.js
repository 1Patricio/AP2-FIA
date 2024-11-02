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
function calcularDistanciaTotal(rotaAtual) {
    let distancia = 0;
    for (let i = 0; i < rotaAtual.length - 1; i++) {
        distancia += calculoDistanciaEntrePontos(rotaAtual[i], rotaAtual[i + 1]);
    }
    distancia += calculoDistanciaEntrePontos(rotaAtual[rotaAtual.length - 1], rotaAtual[0]);
    return distancia;
}

// Gera um caminho aleatório (indivíduo) percorrendo todas as cidades
function gerarCaminhoAleatorio() {
    const rotaAtual = [...cidades];
    for (let cidadeIndice = rotaAtual.length - 1; cidadeIndice > 0; cidadeIndice--) {
        const cidadeAleatoriaIndice = Math.floor(Math.random() * (cidadeIndice + 1));
        [rotaAtual[cidadeIndice], rotaAtual[cidadeAleatoriaIndice]] = [rotaAtual[cidadeAleatoriaIndice], rotaAtual[cidadeIndice]]; // Embaralha as cidades
    }
    return rotaAtual;
}

// Cria uma nova população inicial de rotas
function criargrupoCaminhos(tamanho) {
    const grupoCaminhos = [];
    for (let i = 0; i < tamanho; i++) {
        grupoCaminhos.push(gerarCaminhoAleatorio());
    }
    return grupoCaminhos;
}

function aptidao(rotaAtual) {
    const distancia = calcularDistanciaTotal(rotaAtual);

    if (distancia > 0) {
        return 1 / distancia;
    } else {
        return 1000;
    }
}


// Seleção - escolhe indivíduos mais aptos para cruzamento
function escolherMelhoresCaminhos(grupoCaminhos) {
    const selecionados = [];
    grupoCaminhos.forEach(rotaAtual => {
        const pontos = aptidao(rotaAtual) * 100; // Multiplica aptidão para probabilidade maior de seleção
        for (let i = 0; i < pontos; i++) {
            selecionados.push(rotaAtual);
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
function mutacao(rotaAtual) {
    const rotaAtualMutante = [...rotaAtual];
    for (let i = 0; i < rotaAtualMutante.length; i++) {
        if (Math.random() < chanceMutacao) {
            const indiceAleatorio = Math.floor(Math.random() * rotaAtualMutante.length);
            // Troca duas cidades de lugar
            [rotaAtualMutante[i], rotaAtualMutante[indiceAleatorio]] = [rotaAtualMutante[indiceAleatorio], rotaAtualMutante[i]];
        }
    }
    return rotaAtualMutante; // Retorna o caminho com possíveis mutações
}

// Função auxiliar para selecionar um elemento aleatório de um array
function escolhaAleatoria(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Função principal do algoritmo genético
function algoritmoGenetico() {
    let grupoCaminhos = criargrupoCaminhos(numeroCaminhos);    

    for (let geracao = 0; geracao < maximoGeracoes; geracao++) {
        grupoCaminhos.sort((a, b) => aptidao(b) - aptidao(a)); // Ordena pela aptidão (do melhor para o pior)
        
        
        const melhorRotaAtual = grupoCaminhos[0];

        // Adiciona a primeira cidade ao final para que o caminho termine na cidade inicial
        if (melhorRotaAtual[0] !== melhorRotaAtual[melhorRotaAtual.length - 1]) {
            melhorRotaAtual.push(melhorRotaAtual[0]);
        }
        
        const menorDistancia = 1 / aptidao(melhorRotaAtual); // Calcula a menor distância para o melhor caminho
        
        // Verifica se o objetivo foi alcançado
        if (menorDistancia <= objetivoDistancia) {
            console.log(`Geração ${geracao}, Melhor Distância: ${menorDistancia.toFixed(2)}`);
            console.log("Solução encontrada com a distância mínima desejada!");
            console.log("Melhor Caminho: ", melhorRotaAtual);
            break;
        } else {
            console.log(`Geração ${geracao}, Sua distância: ${menorDistancia.toFixed(2)}, Seu caminho atual: `); 
            console.log(melhorRotaAtual)
        }
        
         // Cria nova população com elitismo (mantém o melhor caminho)
         const novoGrupoCaminhos = [];


        while (novoGrupoCaminhos.length < numeroCaminhos) {
            const [rotaAtual1, rotaAtual2] = escolherMelhoresCaminhos(grupoCaminhos); // Seleciona dois pais
            let filho = cruzarCaminhos(rotaAtual1, rotaAtual2); // Realiza o cruzamento
            filho = mutacao(filho); // Aplica mutação
            novoGrupoCaminhos.push(filho); // Adiciona novo caminho à nova população
        }

        grupoCaminhos = novoGrupoCaminhos; // Atualiza a população para a próxima geração
    }
}

// Executa o algoritmo genético
algoritmoGenetico();