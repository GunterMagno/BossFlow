/**
 * Script simple para comparar performance CON y SIN índices
 * Uso: node tests/test-performance.js
 */

const mongoose = require('mongoose');
const Diagram = require('../models/Diagram');
const User = require('../models/User');
require('dotenv').config();

async function runTests() {
    try {
        console.log('🚀 Iniciando comparación de performance...\n');
        
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bossflow_test');
        console.log('✅ Conectado a MongoDB\n');
        
        // Crear múltiples usuarios para demostrar el impacto del índice
        console.log('📝 Preparando datos de prueba...');
        
        // Usuario principal
        let testUser = await User.findOne({ email: 'test@example.com' });
        if (!testUser) {
            testUser = await User.create({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            });
        }
        
        // Crear 4 usuarios adicionales con diagramas
        for (let u = 1; u <= 4; u++) {
            let otherUser = await User.findOne({ email: `user${u}@example.com` });
            if (!otherUser) {
                otherUser = await User.create({
                    username: `user${u}`,
                    email: `user${u}@example.com`,
                    password: 'password123'
                });
                
                // Crear 50 diagramas para cada usuario adicional
                const diagrams = [];
                for (let i = 0; i < 50; i++) {
                    diagrams.push({
                        title: `User${u} Diagram ${i}`,
                        description: `Descripción ${i}`,
                        userId: otherUser._id,
                        nodes: [{ id: '1', type: 'default', position: { x: 0, y: 0 }, data: {} }],
                        edges: []
                    });
                }
                await Diagram.insertMany(diagrams);
            }
        }
        
        // Crear diagramas para el usuario de prueba principal
        const diagramCount = await Diagram.countDocuments({ userId: testUser._id });
        if (diagramCount < 50) {
            const diagrams = [];
            for (let i = diagramCount; i < 50; i++) {
                diagrams.push({
                    title: `Test Diagrama ${i}`,
                    description: `Descripción del diagrama ${i}`,
                    userId: testUser._id,
                    nodes: [{ id: '1', type: 'default', position: { x: 0, y: 0 }, data: {} }],
                    edges: []
                });
            }
            await Diagram.insertMany(diagrams);
        }
        
        const totalDiagrams = await Diagram.countDocuments();
        console.log(`\n📊 Total de diagramas en BD: ${totalDiagrams}`);
        console.log(`📊 Diagramas del usuario: ${diagramCount}\n`);
        
        // ======================================
        // PASO 1: SIN ÍNDICES
        // ======================================
        console.log('🔴 ELIMINANDO índices para prueba...');
        await Diagram.collection.dropIndexes();
        await Diagram.collection.createIndex({ _id: 1 }); // Recrear solo _id
        
        const indexesSin = await Diagram.collection.getIndexes();
        console.log('   Índices actuales:', Object.keys(indexesSin).join(', '));
        
        // Medir SIN índices - Buscar TODOS los diagramas del usuario
        const statsSin = await Diagram.find({ userId: testUser._id })
            .sort({ updatedAt: -1 })
            .explain('executionStats');
        
        console.log('\n📉 RESULTADOS SIN ÍNDICES (buscar por userId):');
        console.log(`   ⏱️  Tiempo: ${statsSin.executionStats.executionTimeMillis}ms`);
        console.log(`   📄 Docs TOTALES examinados: ${statsSin.executionStats.totalDocsExamined} (escanea TODA la colección)`);
        console.log(`   ✅ Docs retornados: ${statsSin.executionStats.nReturned} (solo los del usuario)`);
        console.log(`   🔍 Tipo de scan: ${statsSin.executionStats.executionStages.stage}`);
        console.log(`   ❌ Eficiencia: ${((statsSin.executionStats.nReturned / statsSin.executionStats.totalDocsExamined) * 100).toFixed(1)}%`);
        
        // ======================================
        // PASO 2: CON ÍNDICES
        // ======================================
        console.log('\n🟢 CREANDO índices optimizados...');
        await Diagram.collection.createIndex({ userId: 1, updatedAt: -1 });
        await Diagram.collection.createIndex({ title: 1, userId: 1 }, { unique: true });
        
        const indexesCon = await Diagram.collection.getIndexes();
        console.log('   Índices creados:', Object.keys(indexesCon).join(', '));
        
        // Medir CON índices - Buscar TODOS los diagramas del usuario
        const statsCon = await Diagram.find({ userId: testUser._id })
            .sort({ updatedAt: -1 })
            .explain('executionStats');
        
        console.log('\n📈 RESULTADOS CON ÍNDICES (buscar por userId):');
        console.log(`   ⏱️  Tiempo: ${statsCon.executionStats.executionTimeMillis}ms`);
        console.log(`   📄 Docs TOTALES examinados: ${statsCon.executionStats.totalDocsExamined} (solo los del índice)`);
        console.log(`   ✅ Docs retornados: ${statsCon.executionStats.nReturned}`);
        console.log(`   🔍 Índice usado: ${statsCon.executionStats.executionStages.indexName || 'IXSCAN'}`);
        console.log(`   ✅ Eficiencia: ${((statsCon.executionStats.nReturned / statsCon.executionStats.totalDocsExamined) * 100).toFixed(1)}%`);
        
        // ======================================
        // COMPARACIÓN
        // ======================================
        console.log('\n' + '='.repeat(60));
        console.log('📊 COMPARACIÓN: Buscar todos los diagramas de un usuario');
        console.log('='.repeat(60));
        console.log(`SIN índice: Examina ${statsSin.executionStats.totalDocsExamined} docs para retornar ${statsSin.executionStats.nReturned}`);
        console.log(`CON índice: Examina ${statsCon.executionStats.totalDocsExamined} docs para retornar ${statsCon.executionStats.nReturned}`);
        console.log(`\n🚀 Reducción de escaneo: ${statsSin.executionStats.totalDocsExamined - statsCon.executionStats.totalDocsExamined} documentos menos`);
        
        const reduccion = ((1 - statsCon.executionStats.totalDocsExamined / statsSin.executionStats.totalDocsExamined) * 100).toFixed(1);
        console.log(`📉 Mejora en eficiencia: ${reduccion}%`);
        console.log('='.repeat(60));
        
        if (statsCon.executionStats.totalDocsExamined < statsSin.executionStats.totalDocsExamined) {
            console.log('\n✅ El índice está FUNCIONANDO correctamente');
        } else {
            console.log('\n⚠️  Aumenta el número de usuarios/diagramas para ver más impacto');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('\n👋 Desconectado\n');
        process.exit(0);
    }
}

runTests();
