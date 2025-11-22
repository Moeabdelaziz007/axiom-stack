#!/usr/bin/env python3
"""
Automated cron-job.org setup using REST API
Docs: https://docs.cron-job.org/rest-api.html
"""

import requests
import json

# Configuration
API_KEY = "c98msKQLExnEokLfhAbXCbfn8YtdO8ccgS06jRqoCD0="
BASE_URL = "https://api.cron-job.org"

# Worker configuration
WORKER_URL = "https://social-agent.amrikyy.workers.dev/trigger"
CRON_SECRET = "axiom_social_agent_2025_secure_key_1732263130"

# Jobs configuration
JOBS = [
    {
        "title": "Axiom Social - Wins Pillar",
        "url": f"{WORKER_URL}?pillar=wins&key={CRON_SECRET}",
        "schedule": {
            "hours": [9],
            "minutes": [0],
            "mdays": [-1],  # Every day
            "months": [-1],  # Every month
            "wdays": [-1]   # Every weekday
        },
        "timezone": "UTC"
    },
    {
        "title": "Axiom Social - Tech Pillar",
        "url": f"{WORKER_URL}?pillar=tech&key={CRON_SECRET}",
        "schedule": {
            "hours": [14],
            "minutes": [0],
            "mdays": [-1],
            "months": [-1],
            "wdays": [-1]
        },
        "timezone": "UTC"
    },
    {
        "title": "Axiom Social - Vision Pillar",
        "url": f"{WORKER_URL}?pillar=vision&key={CRON_SECRET}",
        "schedule": {
            "hours": [20],
            "minutes": [0],
            "mdays": [-1],
            "months": [-1],
            "wdays": [-1]
        },
        "timezone": "UTC"
    }
]

def create_job(job_config):
    """Create a single cron job"""
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "job": {
            "enabled": True,
            "title": job_config["title"],
            "saveResponses": True,
            "url": job_config["url"],
            "auth": {
                "enable": False
            },
            "notification": {
                "onFailure": True,
                "onSuccess": False
            },
            "extendedData": {
                "headers": []
            },
            "requestMethod": 0,  # GET
            "schedule": {
                "timezone": job_config["timezone"],
                "hours": job_config["schedule"]["hours"],
                "minutes": job_config["schedule"]["minutes"],
                "mdays": job_config["schedule"]["mdays"],
                "months": job_config["schedule"]["months"],
                "wdays": job_config["schedule"]["wdays"]
            }
        }
    }
    
    response = requests.put(
        f"{BASE_URL}/jobs",
        headers=headers,
        json=payload
    )
    
    return response

def list_jobs():
    """List all existing jobs"""
    headers = {
        "Authorization": f"Bearer {API_KEY}"
    }
    
    response = requests.get(
        f"{BASE_URL}/jobs",
        headers=headers
    )
    
    return response

def main():
    print("🎯 Axiom Social Agent - Automated Cron Setup\n")
    print("=" * 60)
    
    # Check existing jobs
    print("\n📋 Checking existing jobs...")
    list_response = list_jobs()
    
    if list_response.status_code == 200:
        existing = list_response.json()
        print(f"✅ Found {len(existing.get('jobs', []))} existing job(s)")
    else:
        print(f"⚠️  Could not fetch jobs: {list_response.status_code}")
        print(f"   Response: {list_response.text}")
    
    # Create jobs
    print("\n🚀 Creating new jobs...\n")
    
    for i, job in enumerate(JOBS, 1):
        print(f"{i}. Creating: {job['title']}")
        print(f"   URL: {job['url'][:50]}...")
        print(f"   Schedule: Daily at {job['schedule']['hours'][0]:02d}:{job['schedule']['minutes'][0]:02d} UTC")
        
        response = create_job(job)
        
        if response.status_code in [200, 201]:
            data = response.json()
            job_id = data.get('jobId')
            print(f"   ✅ SUCCESS! Job ID: {job_id}\n")
        else:
            print(f"   ❌ FAILED: {response.status_code}")
            print(f"   Response: {response.text}\n")
    
    # Show final status
    print("=" * 60)
    print("\n📊 Final Status:\n")
    
    list_response = list_jobs()
    if list_response.status_code == 200:
        jobs_data = list_response.json()
        jobs_list = jobs_data.get('jobs', [])
        
        print(f"Total Active Jobs: {len(jobs_list)}\n")
        
        for job in jobs_list:
            print(f"✓ {job['title']}")
            print(f"  ID: {job['jobId']}")
            print(f"  Enabled: {'✅' if job['enabled'] else '❌'}")
            print(f"  Next Run: Check dashboard\n")
    
    print("=" * 60)
    print("\n🎉 Setup Complete!")
    print("\n📱 Check your dashboard: https://console.cron-job.org/jobs")
    print("📬 First post tomorrow at 09:00 UTC!")

if __name__ == "__main__":
    main()
