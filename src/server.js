// src/server.js
const express = require('express');
const path = require('path');
const { getLatLongFromCEP } = require('./conversion');
const { getIrradiacaoSolar } = require('./scraping');

const app = express();
const PORT = 3000;

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Rota para scraping
app.get('/scrape/:cep', async (req, res) => {
    const cep = req.params.cep;
    const coordinates = await getLatLongFromCEP(cep);

    if (coordinates) {
        const { lat, lon } = coordinates;
        const taxaDeIrradiacao = await getIrradiacaoSolar(lat, lon);
        res.json({ cep, lat, lon, taxaDeIrradiacao });
    } else {
        res.status(500).json({ error: 'Falha ao obter coordenadas para o CEP fornecido.' });
    }
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
