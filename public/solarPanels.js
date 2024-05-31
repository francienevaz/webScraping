// src/solarPanels.js

// const { getTaxaDeIrradiacao } = require('../src/scrapingResult');

document.addEventListener('DOMContentLoaded', () => {
    const calcularButton = document.getElementById('calcular');
    calcularButton.addEventListener('click', howManyPanelsYouNeed);
});

async function howManyPanelsYouNeed() {
    let cep = document.getElementById('cep').value;
    let consumo = document.getElementById('consumo').value;
    const result = document.getElementById('result');
    const wattsPlaca = 555;

    if (!cep || !consumo) {
        result.innerHTML = '<p>Por favor, insira o CEP e o consumo.</p>';
        return;
    }

    try {
        const response = await fetch(`/scrape/${cep}`);
        const data = await response.json();

        let taxaDeIrradiacao = data.taxaDeIrradiacao;
        console.log(`Taxa de Irradiação: ${taxaDeIrradiacao}`);

        let margemEstimada;
        if (consumo > 300) {
            margemEstimada = 0.20;
        } else if (consumo > 200) {
            margemEstimada = 0.15;
        } else {
            margemEstimada = 0;
        }

        consumo *= (1 + margemEstimada);

        let kwd = consumo / 30;
        let kwp = kwd / taxaDeIrradiacao;
        let watts = kwp * 1000;
        let placasNecessarias = Math.ceil(watts / wattsPlaca);

        result.innerHTML = `
            <p>O seu Kwp é ${kwp.toFixed(2)}</p>
            <p>Você precisa de ${placasNecessarias} placas solares.</p>
            <p>A potência do seu Gerador é de ${((placasNecessarias * wattsPlaca)/1000)} Kwts.</p>
        `;

        return placasNecessarias;

    } catch (error) {
        console.error('Erro ao calcular a quantidade de placas necessárias:', error.message);
        result.innerHTML = `<p>Erro ao calcular a quantidade de placas necessárias: ${error.message}</p>`;
    }
       
}




