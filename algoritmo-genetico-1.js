const objetivo = "HELLO WORLD";    // 11 Caracteres
const individuo = "AGYYH WORLL";   // Vai comparando letra poor letra 
const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ "; //Lembra de colocar um espaço, pois contam como caracter

const tamanhoPopulacao = 200;
const mutationRate = 0.01;
const geracoes = 1000;

// Função para calcular a distância entre dois pontos, estruturada como criarIndividuo
function calcularDistancia() {
    let distancia = "";
    for (let i = 0; i < 1; i++) {
        let dx = Math.pow((cidadeB[0] - cidadeA[0]), 2);
        let dy = Math.pow((cidadeB[1] - cidadeA[1]), 2);
        distancia += Math.sqrt(dx + dy);
    }

    return distancia;
}


// Criar um novo conjunto de elementos
function criarPopulacao(tamanho){
    const populacao = [];
    for (let i = 0; i < tamanho; i++) {
        populacao.push(criarIndividuo())        
    }
    return populacao;
}

// Função fitness - Encaixado no objetivo - Base em uma pontução
function aptidao(individuo){
    let pontos = 0;
    for (let i = 0; i < objetivo.length; i++) {
        if(individuo[i] === objetivo[i]){
            pontos++
        }        
    }
    return pontos;
}

function selecao(populacao){    //[0,0,0,1,1,2,2,2]
    const selecionados = [];

    populacao.forEach(individuo => {
        const pontos = aptidao(individuo);
        for (let i = 0; i < pontos; i++) {
            selecionados.push(individuo);            
        }
    });

    return [escolhaAleatoria(selecionados), escolhaAleatoria(selecionados)];
}

function cruzamento(individuo1, individuo2){     
    const pontosDeCorte = Math.floor(Math.random() * objetivo.length);
    const filho = individuo1.slice(0, pontosDeCorte) + individuo2.slice(pontosDeCorte);
    return filho;
}

function mutacao(individuo){
    let individuoMutante = "";
    for (let i = 0; i < individuo.length; i++) {
        if (Math.random() < mutationRate) {
            individuoMutante += caracteres.charAt(Math.floor(Math.random() * caracteres.length))
        } else {
            individuoMutante += individuo[i];
        }
    }

    return individuoMutante;
}

function escolhaAleatoria(array){
    return array[Math.floor(Math.random() * array.length)];
}

function algoritmoGenetico(){
    let populacao = criarPopulacao(tamanhoPopulacao);

    for (let geracao = 0; geracao < geracoes; geracao++) {
        populacao.sort((a,b) => aptidao(b) - aptidao(a));    // Sorteio

        console.log(`geracao atual: ${geracao}, Melhor individuo: ${populacao[0]}`)

        if (aptidao(populacao[0]) === objetivo.length) {
            console.log("Solução encontrada!");
            break;
        }

        // Se não atingimos o objetivo, vamos criar uma nova população
        const novaPopulacao = [];

        while (novaPopulacao.length < tamanhoPopulacao) { //Vídeo em 47,00
            const [individuo1, individuo2] = selecao(populacao);
            let filho = cruzamento(individuo1, individuo2);
            filho = mutacao(filho);
            novaPopulacao.push(filho);
        }

        populacao = novaPopulacao;
    }  
}
algoritmoGenetico();