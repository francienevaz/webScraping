// src/scrapingResult.js
let taxaDeIrradiacao = null;

function setTaxaDeIrradiacao(valor) {
    taxaDeIrradiacao = valor;
}

function getTaxaDeIrradiacao() {
    return taxaDeIrradiacao;
}

module.exports = { setTaxaDeIrradiacao, getTaxaDeIrradiacao };