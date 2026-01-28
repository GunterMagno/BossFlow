/**
 * Simple script to compare performance WITH and WITHOUT indexes
 * Usage: node tests/test-performance.js
 */

const mongoose = require('mongoose');
const Diagram = require('../models/Diagram');
const User = require('../models/User');
require('dotenv').config();

async function runTests() {
    try {
        console.log('🚀 Starting performance comparison...\n');
        
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bossflow_test');
        console.log('✅ Connected to MongoDB\n');
        
        // Create multiple users to demonstrate the index impact
        console.log('📝 Preparing test data...');
        
        // Main user
        let testUser = await User.findOne({ email: 'test@example.com' });
        if (!testUser) {
            testUser = await User.create({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            });
        }
        
        // Create 4 additional users with diagrams
        for (let u = 1; u <= 4; u++) {
            let otherUser = await User.findOne({ email: `user${u}@example.com` });
            if (!otherUser) {
                otherUser = await User.create({
                    username: `user${u}`,
                    email: `user${u}@example.com`,
                    password: 'password123'
                });
                
                // Create 50 diagrams for each additional user
                const diagrams = [];
                for (let i = 0; i < 50; i++) {
                    diagrams.push({
                        title: `User${u} Diagram ${i}`,
                        description: `Description ${i}`,
                        userId: otherUser._id,
                        nodes: [{ id: '1', type: 'default', position: { x: 0, y: 0 }, data: {} }],
                        edges: []
                    });
                }
                await Diagram.insertMany(diagrams);
            }
        }
        
        // Create diagrams for the main test user
        const diagramCount = await Diagram.countDocuments({ userId: testUser._id });
        if (diagramCount < 50) {
            const diagrams = [];
            for (let i = diagramCount; i < 50; i++) {
                diagrams.push({
                    title: `Test Diagram ${i}`,
                    description: `Diagram description ${i}`,
                    userId: testUser._id,
                    nodes: [{ id: '1', type: 'default', position: { x: 0, y: 0 }, data: {} }],
                    edges: []
                });
            }
            await Diagram.insertMany(diagrams);
        }
        
        const totalDiagrams = await Diagram.countDocuments();
        console.log(`\n📊 Total diagrams in DB: ${totalDiagrams}`);
        console.log(`📊 User's diagrams: ${diagramCount}\n`);
        
        // ======================================
        // STEP 1: WITHOUT INDEXES
        // ======================================
        console.log('🔴 DROPPING indexes for test...');
        await Diagram.collection.dropIndexes();
        await Diagram.collection.createIndex({ _id: 1 }); // Recreate only _id

        const indexesWithout = await Diagram.collection.getIndexes();
        console.log('   Current indexes:', Object.keys(indexesWithout).join(', '));

        // Measure WITHOUT indexes - find ALL diagrams for the user
        const statsWithout = await Diagram.find({ userId: testUser._id })
            .sort({ updatedAt: -1 })
            .explain('executionStats');

        console.log('\n📉 RESULTS WITHOUT INDEXES (search by userId):');
        console.log(`   ⏱️  Time: ${statsWithout.executionStats.executionTimeMillis}ms`);
        console.log(`   📄 Total DOCS examined: ${statsWithout.executionStats.totalDocsExamined} (scans the ENTIRE collection)`);
        console.log(`   ✅ Docs returned: ${statsWithout.executionStats.nReturned} (only the user's)`);
        console.log(`   🔍 Scan type: ${statsWithout.executionStats.executionStages.stage}`);
        console.log(`   ❌ Efficiency: ${((statsWithout.executionStats.nReturned / statsWithout.executionStats.totalDocsExamined) * 100).toFixed(1)}%`);
        
        // ======================================
        // STEP 2: WITH INDEXES
        // ======================================
        console.log('\n🟢 CREATING optimized indexes...');
        await Diagram.collection.createIndex({ userId: 1, updatedAt: -1 });
        await Diagram.collection.createIndex({ title: 1, userId: 1 }, { unique: true });

        const indexesWith = await Diagram.collection.getIndexes();
        console.log('   Created indexes:', Object.keys(indexesWith).join(', '));

        // Measure WITH indexes - find ALL diagrams for the user
        const statsWith = await Diagram.find({ userId: testUser._id })
            .sort({ updatedAt: -1 })
            .explain('executionStats');

        console.log('\n📈 RESULTS WITH INDEXES (search by userId):');
        console.log(`   ⏱️  Time: ${statsWith.executionStats.executionTimeMillis}ms`);
        console.log(`   📄 Total DOCS examined: ${statsWith.executionStats.totalDocsExamined} (only those from the index)`);
        console.log(`   ✅ Docs returned: ${statsWith.executionStats.nReturned}`);
        console.log(`   🔍 Index used: ${statsWith.executionStats.executionStages.indexName || 'IXSCAN'}`);
        console.log(`   ✅ Efficiency: ${((statsWith.executionStats.nReturned / statsWith.executionStats.totalDocsExamined) * 100).toFixed(1)}%`);
        
        // ======================================
        // COMPARISON
        // ======================================
        console.log('\n' + '='.repeat(60));
        console.log('📊 COMPARISON: Search all diagrams for a user');
        console.log('='.repeat(60));
        console.log(`Without index: Scans ${statsWithout.executionStats.totalDocsExamined} docs to return ${statsWithout.executionStats.nReturned}`);
        console.log(`With index: Scans ${statsWith.executionStats.totalDocsExamined} docs to return ${statsWith.executionStats.nReturned}`);
        console.log(`\n🚀 Scan reduction: ${statsWithout.executionStats.totalDocsExamined - statsWith.executionStats.totalDocsExamined} fewer documents`);

        const reduction = ((1 - statsWith.executionStats.totalDocsExamined / statsWithout.executionStats.totalDocsExamined) * 100).toFixed(1);
        console.log(`📉 Efficiency improvement: ${reduction}%`);
        console.log('='.repeat(60));
        
        if (statsWith.executionStats.totalDocsExamined < statsWithout.executionStats.totalDocsExamined) {
            console.log('\n✅ The index is WORKING correctly');
        } else {
            console.log('\n⚠️  Increase the number of users/diagrams to see more impact');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('\n👋 Disconnected\n');
        process.exit(0);
    }
}

runTests();
