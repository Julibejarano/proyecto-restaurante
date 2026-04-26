const fs = require('fs');
const pdf = require('pdf-parse');

const dataBuffer = fs.readFileSync('c:/Users/julib/Desktop/Ultimo semestre/Admin de Bases de Datos/Proyecto/2025.1-Restaurante (1).pdf');

pdf(dataBuffer).then(function(data) {
    console.log("---- PDF CONTENT START ----");
    console.log(data.text);
    console.log("---- PDF CONTENT END ----");
}).catch(err => console.error(err));
