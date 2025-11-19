# 1. Base Image: Use a modern, slim Python image
FROM python:3.11-slim

# 2. Set Environment Variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PORT 8080

# 3. Set Working Directory
WORKDIR /app

# 4. Install Dependencies
# Copy requirements first to leverage Docker layer caching
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# 5. Copy Application Code
# This copies main.py and the entire superpowers/ directory
COPY . .

# 6. Expose Port (Cloud Run default)
EXPOSE 8080

# 7. Run the Application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]