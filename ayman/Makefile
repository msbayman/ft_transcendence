# Variables
COMPOSE_FILE = docker-compose.yml

# Targets
.PHONY: up down restart build clean logs

# Start the containers
up:
	@echo "Starting containers..."
	docker-compose -f $(COMPOSE_FILE) up -d

# Stop the containers
down:
	@echo "Stopping containers..."
	docker-compose -f $(COMPOSE_FILE) down

# Restart the containers
restart:
	@echo "Restarting containers..."
	docker-compose -f $(COMPOSE_FILE) down
	docker-compose -f $(COMPOSE_FILE) up -d

# Build or rebuild the containers
build:
	@echo "Building containers..."
	docker-compose -f $(COMPOSE_FILE) up --build -d

# Clean up (stop containers and remove volumes)
clean:
	@echo "Cleaning up containers and volumes..."
	docker-compose -f $(COMPOSE_FILE) down -v

# View logs
logs:
	@echo "Displaying logs..."
	docker-compose -f $(COMPOSE_FILE) logs -f
