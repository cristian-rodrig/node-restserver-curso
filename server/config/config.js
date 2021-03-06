//===================================
// Puerto
//===================================

process.env.PORT = process.env.PORT || 4000;


//===================================
// Entorno
//===================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//===================================
// Vencimiento del token
//===================================
//60 segundos * 60 minutos * 24horas * 30 dias
process.env.CADUCIDAD_TOKEN =  '48h';

//===================================
// SEED semilla de autenticacion
//===================================
process.env.SEED_TOKEN = process.env.SEED_TOKEN ||'este-es-el-seed-de-desarrollo';


//===================================
// Base de datos
//===================================

let urlDB;

if(process.env.NODE_ENV=== 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//===================================
// Google client ID
//===================================

process.env.CLIENT_ID || '215851896955-r8q4glgkr7b5fs0u9et8smv390uv4mnf.apps.googleusercontent.com';





