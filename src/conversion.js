// src/conversion.js
const axios = require('axios');

async function getLatLongFromCEP(cep) {
    try {
        const responseViaCEP = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        const { logradouro, localidade, uf } = responseViaCEP.data;

        const enderecoCompleto = `${logradouro}, ${localidade}, ${uf}, Brasil`;

        const responseOSM = await axios.get('https://nominatim.openstreetmap.org/search', {
            params: {
                q: enderecoCompleto,
                format: 'json',
                addressdetails: 1,
                limit: 1
            }
        });

        if (responseOSM.data.length > 0) {
            const { lat, lon } = responseOSM.data[0];
            return { lat, lon };
        } else {
            throw new Error('Endereço não encontrado nas coordenadas.');
        }
    } catch (error) {
        console.error('Erro ao converter CEP para latitude e longitude:', error.message);
        return null;
    }
}

module.exports = { getLatLongFromCEP };
