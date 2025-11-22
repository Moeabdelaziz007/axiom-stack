// Test Telegram posting manually
// Run: npx ts-node scripts/test-telegram.ts

async function testTelegram() {
    const WORKER_URL = 'https://social-agent.amrikyy.workers.dev';

    console.log('🧪 Testing Telegram Publishing...\n');

    // Test 1: Manual publish with text
    console.log('Test 1: Text Message');
    const response1 = await fetch(`${WORKER_URL}/manual-publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            pillar: 'wins',
            content: {
                title: 'Test Post - Bitcoin Rally!',
                data: {
                    token_symbol: 'BTC',
                    profit_pct: 15.5,
                    volume_usd: 100000
                }
            }
        })
    });

    const result1 = await response1.json();
    console.log('Response:', JSON.stringify(result1, null, 2));

    if (result1.success) {
        const telegramResult = result1.publishResults.find((r: any) => r.channel === 'telegram');
        if (telegramResult?.success) {
            console.log('✅ Message sent to Telegram!');
            console.log(`   Message ID: ${telegramResult.id}\n`);
        } else {
            console.log('❌ Telegram failed:', telegramResult?.error);
        }
    }

    console.log('\n📱 Check your Telegram for the message!');
    console.log('   Bot: @AxiomID_Bot');
}

testTelegram().catch(console.error);
