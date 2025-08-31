# Use lightweight Python base
FROM python:3.12-slim

# Set work directory
WORKDIR /app

# Copy requirements first for caching
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy sensor simulator code
COPY sensor_simulator.py .

# Run the simulator
CMD ["python", "-u", "sensor_simulator.py"]
