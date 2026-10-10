require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const repo = require('../repositories/repositoryFactory');
const assessmentService = require('../services/assessment/assessmentService');

const seedData = async () => {
  try {
    await connectDB();
    console.log('[Seed] Connected to MongoDB. Initializing seed procedure...');

    // 1. Check or Create Admin Account
    const adminEmail = process.env.ADMIN_SEED_EMAIL || 'admin@ewaste.org';
    const adminPassword = process.env.ADMIN_SEED_PASSWORD || 'AdminPass123!';

    let admin = await repo.users.findByEmail(adminEmail);
    if (!admin) {
      admin = await repo.users.create({
        fullName: 'Super Administrator',
        email: adminEmail,
        username: 'admin',
        password: adminPassword,
        phone: '+1 (555) 019-2831',
        role: 'admin'
      });
      console.log(`[Seed] ✅ Created Super Admin Account: ${adminEmail}`);
    } else {
      console.log(`[Seed] ℹ️ Admin account ${adminEmail} already exists.`);
    }

    // 2. Create Sample Agents
    const agentsList = [
      { fullName: 'Sarah Jenkins (Tech Recycler)', email: 'agent.sarah@ewaste.org', username: 'agent_sarah', phone: '+1 (555) 892-1001' },
      { fullName: 'Marcus Vance (Refurb Specialist)', email: 'agent.marcus@ewaste.org', username: 'agent_marcus', phone: '+1 (555) 892-1002' }
    ];

    const seededAgents = [];
    for (const a of agentsList) {
      let agentObj = await repo.users.findByEmail(a.email);
      if (!agentObj) {
        agentObj = await repo.users.create({
          ...a,
          password: 'AgentPass123!',
          role: 'agent'
        });
        console.log(`[Seed] ✅ Created Field Agent Account: ${a.email}`);
      }
      seededAgents.push(agentObj);
    }

    // 3. Create Sample Demo User
    const demoUserEmail = 'user@ewaste.org';
    let demoUser = await repo.users.findByEmail(demoUserEmail);
    if (!demoUser) {
      demoUser = await repo.users.create({
        fullName: 'Alex Morgan',
        email: demoUserEmail,
        username: 'alex_morgan',
        password: 'UserPass123!',
        phone: '+1 (555) 302-8819',
        role: 'user'
      });
      console.log(`[Seed] ✅ Created Demo User Account: ${demoUserEmail}`);
    }

    // 4. Create Sample E-Waste Cases if none exist
    const userCases = await repo.cases.findByUser(demoUser._id, { limit: 10 });
    if (userCases.cases.length === 0) {
      const sampleCasesData = [
        {
          productName: 'MacBook Pro 15" (2018)',
          category: 'laptop',
          brand: 'Apple',
          model: 'A1990',
          approxAge: '3-5 years',
          quantity: 1,
          physicalCondition: 'partially working',
          visibleDamage: 'Keyboard backlight flickering, minor aluminum dent',
          batteryStatus: 'Service Recommended (82% capacity)',
          pickupAddress: '742 Evergreen Terrace, Springfield',
          preferredContact: 'alex_morgan@example.com',
          status: 'Under Review'
        },
        {
          productName: 'iPhone 11 64GB',
          category: 'mobile phone',
          brand: 'Apple',
          model: 'MWLU2LL/A',
          approxAge: '3-5 years',
          quantity: 1,
          physicalCondition: 'working',
          visibleDamage: 'Minor rear glass hairline crack',
          batteryStatus: 'Normal',
          pickupAddress: '742 Evergreen Terrace, Springfield',
          preferredContact: '+1 (555) 302-8819',
          status: 'Agent Assigned'
        },
        {
          productName: 'Old Dell Monitor 24"',
          category: 'monitor',
          brand: 'Dell',
          model: 'U2412M',
          approxAge: '5+ years',
          quantity: 1,
          physicalCondition: 'not working',
          visibleDamage: 'Screen backlight failure',
          batteryStatus: 'N/A',
          pickupAddress: '742 Evergreen Terrace, Springfield',
          preferredContact: '+1 (555) 302-8819',
          status: 'Submitted'
        }
      ];

      for (let i = 0; i < sampleCasesData.length; i++) {
        const item = sampleCasesData[i];
        const caseRef = `EWC-2026-${1080 + i}`;
        const newCase = await repo.cases.create({
          ...item,
          caseReference: caseRef,
          userId: demoUser._id,
          assignedAgentId: item.status === 'Agent Assigned' ? seededAgents[0]._id : null,
          assignedAt: item.status === 'Agent Assigned' ? new Date() : null,
          images: [{ url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80', key: 'sample-laptop' }]
        });

        // Assessment
        const assessmentData = await assessmentService.evaluateDevice(item);
        assessmentData.caseId = newCase._id;
        await repo.assessments.create(assessmentData);

        // Status History
        await repo.statusHistory.create({
          caseId: newCase._id,
          previousStatus: 'None',
          newStatus: item.status,
          changedBy: demoUser._id,
          changedByName: demoUser.fullName,
          changedByRole: 'user',
          reasonOrNotes: 'Initial seed case'
        });

        console.log(`[Seed] ✅ Created Sample Case: ${caseRef} (${item.productName})`);
      }
    }

    console.log(`
======================================================
🎉 SEED COMPLETED SUCCESSFULLY!
------------------------------------------------------
Admin Login:  ${adminEmail}  | Password: ${adminPassword}
Agent Login:  agent.sarah@ewaste.org | Password: AgentPass123!
User Login:   user@ewaste.org | Password: UserPass123!
======================================================
    `);

    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error]: ${error.message}`);
    process.exit(1);
  }
};

seedData();
