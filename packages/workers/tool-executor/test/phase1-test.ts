import { ProductScraperClient, AffiliateClient } from '../src/tools/affiliate';
import { ShopifyClient } from '../src/tools/shopify';
import { StripeClient } from '../src/tools/stripe';
import { SpeechClient } from '../src/tools/speech';

async function runTests() {
    console.log('--- Starting Phase 1 Tool Tests ---');

    // Test Affiliate Tools
    console.log('\n1. Testing Affiliate Tools');
    const scraper = new ProductScraperClient();
    const product = await scraper.scrape('https://example.com/product');
    console.log('Scrape Result:', product.title === "Mock Product Title" ? "PASS" : "FAIL");

    const affiliate = new AffiliateClient();
    const link = await affiliate.generateLink('123', 'amazon');
    console.log('Link Gen Result:', link.includes('amazon.com') ? "PASS" : "FAIL");

    // Test Shopify Tools
    console.log('\n2. Testing Shopify Tools');
    const shopify = new ShopifyClient('mock_key');
    const sync = await shopify.syncProducts('test-store.myshopify.com');
    console.log('Sync Result:', sync.synced === 10 ? "PASS" : "FAIL");

    // Test Stripe Tools
    console.log('\n3. Testing Stripe Tools');
    const stripe = new StripeClient('mock_key');
    const payment = await stripe.processPayment(100, 'USD', 'cus_123');
    console.log('Payment Result:', payment.status === "succeeded" ? "PASS" : "FAIL");

    // Test Speech Tools
    console.log('\n4. Testing Speech Tools');
    const speech = new SpeechClient('mock_key');
    const analysis = await speech.analyzePronunciation('base64audio', 'en-US');
    console.log('Pronunciation Result:', analysis.score === 85 ? "PASS" : "FAIL");

    console.log('\n--- Tests Completed ---');
}

runTests().catch(console.error);
