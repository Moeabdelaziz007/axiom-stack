#!/usr/bin/env python3
"""
Quick script to get your Telegram Chat ID
Run this after sending a message to your bot
"""

import requests
import sys

BOT_TOKEN = "8073966294:AAG1xA4rD8-5iINyHuv9Ehjw1Pe--B-cnuM"

def get_updates():
    """Fetch recent messages sent to the bot"""
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/getUpdates"
    response = requests.get(url)
    data = response.json()
    
    if not data['ok']:
        print("❌ Error:", data)
        return
    
    if len(data['result']) == 0:
        print("⚠️  No messages found!")
        print("📱 Please send a message to @AxiomID_Bot first")
        print("   Then run this script again.")
        return
    
    print("\n✅ Found recent chats:\n")
    
    seen_ids = set()
    for update in data['result']:
        if 'message' in update:
            msg = update['message']
            chat = msg['chat']
            chat_id = chat['id']
            
            if chat_id not in seen_ids:
                seen_ids.add(chat_id)
                chat_type = chat['type']
                
                if chat_type == 'private':
                    name = f"{chat.get('first_name', '')} {chat.get('last_name', '')}".strip()
                    print(f"👤 Private Chat: {name}")
                    print(f"   Chat ID: {chat_id}")
                    
                elif chat_type in ['group', 'supergroup']:
                    title = chat.get('title', 'Unknown Group')
                    print(f"👥 Group: {title}")
                    print(f"   Chat ID: {chat_id}")
                    
                elif chat_type == 'channel':
                    title = chat.get('title', 'Unknown Channel')
                    print(f"📢 Channel: {title}")
                    print(f"   Chat ID: {chat_id}")
                
                print()
    
    print("\n📋 To use any of these IDs:")
    print(f"   npx wrangler secret put TELEGRAM_CHAT_ID")
    print(f"   # Enter the Chat ID you want to use")

if __name__ == "__main__":
    get_updates()
