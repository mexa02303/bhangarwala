/**
 * EcoGuide AI Chatbot Service
 * ----------------------------
 * Provider-independent chatbot module providing product-aware e-waste guidance,
 * battery safety alerts, data wiping instructions, and assessment explanations.
 */

class ChatbotService {
  async processQuery({ userId, userMessage, caseContext = null }) {
    const llmProvider = process.env.LLM_PROVIDER || 'rule-based';
    const isRuleBased = llmProvider === 'rule-based' || !process.env.LLM_API_KEY;

    // Check query intent against curated knowledge base
    const queryLower = userMessage.toLowerCase();
    let responseText = '';
    let suggestedActions = [];

    // 1. Swollen / Damaged Lithium Battery Warning
    if (queryLower.includes('battery') || queryLower.includes('swollen') || queryLower.includes('leak') || queryLower.includes('fire') || queryLower.includes('hot')) {
      responseText = `⚠️ **CRITICAL BATTERY SAFETY NOTICE:**
Damaged, swollen, or leaking Lithium-ion batteries pose severe fire and chemical hazards.
1. **Do NOT compress, puncture, or drop** the battery or device.
2. **Do NOT place it in standard household trash** or normal recycling bins.
3. Place the device in a cool, non-flammable container (like a glass jar or sand bucket) if possible.
4. Keep it far from flammable materials and request a **specialist inspection** or dedicated hazmat collection.`;
      suggestedActions.push({ label: 'Schedule Hazardous Battery Collection', action: 'submit_case', link: '/submit-ewaste?category=battery' });
    }
    // 2. Data Wiping / Security Instructions
    else if (queryLower.includes('data') || queryLower.includes('wipe') || queryLower.includes('privacy') || queryLower.includes('reset') || queryLower.includes('format') || queryLower.includes('account')) {
      responseText = `🔒 **SAFE DATA WIPING PROCEDURES:**
Before surrendering any smart device, ensure your private photos, passwords, and accounts are completely erased:
- **Apple iOS (iPhone/iPad):** Go to Settings > General > Transfer or Reset iPhone > Erase All Content and Settings. Ensure iCloud / Find My is turned OFF.
- **Android:** Sign out of Google Account first (Settings > Accounts > Remove), then perform Factory Data Reset.
- **Windows PC:** Backup data, go to Settings > System > Recovery > Reset PC > Remove everything & Clean the drive.
- **macOS:** System Settings > General > Transfer or Reset > Erase All Content and Settings.`;
      suggestedActions.push({ label: 'Submit Device for Secure Recycling', action: 'submit_case', link: '/submit-ewaste' });
    }
    // 3. Product-Contextual Query (when opened from a case detail page)
    else if (caseContext) {
      const { productName, category, physicalCondition, assessment } = caseContext;
      const nextAction = assessment?.recommendedNextAction || 'Evaluation pending';
      const repairScore = assessment?.repairabilityScore ?? 'N/A';
      const recyclingScore = assessment?.recyclingScore ?? 'N/A';

      if (queryLower.includes('score') || queryLower.includes('report') || queryLower.includes('meaning') || queryLower.includes('why')) {
        responseText = `📊 **Assessment Summary for ${productName} (${category}):**
- **Condition:** ${physicalCondition}
- **Repairability Score:** ${repairScore}/100
- **Recycling Score:** ${recyclingScore}/100
- **Recommended Disposition:** **${nextAction}**

*Why this result?* Our transparent model evaluates category life expectancy, physical condition, and component harvestability. Devices with high repairability (${repairScore}/100) are prioritized for refurbishment to reduce manufacturing demand.`;
      } else {
        responseText = `Hello! I'm EcoGuide. Regarding your **${productName}** (${category}), it is currently assessed for **${nextAction}**. 
How can I assist you with preparing this item, data erasure, or tracking its collection workflow?`;
      }
      suggestedActions.push({ label: 'View My Product Details', action: 'view_case', link: `/my-cases/${caseContext._id || caseContext.id}` });
    }
    // 4. General Recycling & Platform Questions
    else if (queryLower.includes('how') || queryLower.includes('process') || queryLower.includes('work') || queryLower.includes('steps')) {
      responseText = `♻️ **How E-Waste Circular Recovery Works:**
1. **Submit Device:** Fill in device details and upload clear photos.
2. **AI & Rule Assessment:** Receive instant scoring for repair, component recovery, and recycling.
3. **Agent Review:** Certified recycling agents inspect and confirm the assessment.
4. **Collection & Processing:** We arrange pickup. Devices are either repaired for secondary life or disassembled into raw copper, gold, and aluminum recovery.`;
      suggestedActions.push({ label: 'Start E-Waste Submission', action: 'submit_case', link: '/submit-ewaste' });
    }
    // 5. Default Friendly Guide Response
    else {
      responseText = `Welcome to EcoGuide! I am your AI E-Waste Assistant. 
I can help you with:
- Explaining device repairability vs. recycling potential.
- Providing step-by-step data wiping guides for smartphones, laptops, and PCs.
- Safe handling instructions for swollen lithium batteries.
- Tracking your submitted e-waste pickup status.

What device are you planning to recycle or restore today?`;
      suggestedActions.push({ label: 'E-Waste Category Guide', action: 'guide', link: '/ewaste-guide' });
    }

    return {
      message: responseText,
      isRuleBased,
      metadata: {
        suggestedActions
      }
    };
  }
}

module.exports = new ChatbotService();
