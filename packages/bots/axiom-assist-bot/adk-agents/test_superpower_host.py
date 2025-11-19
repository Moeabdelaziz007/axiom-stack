#!/usr/bin/env python3
"""
Test script for the Superpower Host
"""
import asyncio
import sys
import os

# Add the current directory to the path so we can import the main module
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from main import SuperpowerHost

async def test_superpower_host():
    """Test the SuperpowerHost functionality"""
    print("Testing Superpower Host...")
    
    # Create a superpower host instance
    host = SuperpowerHost()
    
    # Check that superpowers were loaded
    print(f"Loaded superpowers: {list(host.superpowers.keys())}")
    
    # Test the web scraping superpower if it exists
    if 'web_scraping' in host.superpowers:
        print("\nTesting web scraping superpower...")
        try:
            result = await host.execute_superpower('web_scraping', {
                'url': 'https://httpbin.org/html'
            })
            print(f"Web scraping result: {result}")
        except Exception as e:
            print(f"Error testing web scraping: {e}")
    
    # Test the text analysis superpower if it exists
    if 'text_analysis' in host.superpowers:
        print("\nTesting text analysis superpower...")
        try:
            result = await host.execute_superpower('text_analysis', {
                'text': 'This is a sample text for analysis. It contains multiple sentences and words.'
            })
            print(f"Text analysis result: {result}")
        except Exception as e:
            print(f"Error testing text analysis: {e}")
    
    # Test with an invalid superpower
    print("\nTesting invalid superpower...")
    try:
        result = await host.execute_superpower('invalid_power', {})
        print(f"Invalid superpower result: {result}")
    except Exception as e:
        print(f"Expected error for invalid superpower: {e}")

if __name__ == "__main__":
    asyncio.run(test_superpower_host())