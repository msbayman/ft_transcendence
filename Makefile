# Variables
COMPOSE_FILE = docker-compose.yml

# Targets
.PHONY: up down restart build clean clean-all logs clean-cache

# Start the containers
build:
	@echo "Building containers..."
	docker compose -f $(COMPOSE_FILE) up --build

# Stop the containers
up:
	@echo "Starting containers..."
	docker compose -f $(COMPOSE_FILE) up

# Restart the containers
restart:
	@echo "Restarting containers..."
	docker compose -f $(COMPOSE_FILE) down
	docker compose -f $(COMPOSE_FILE) up

# Build or rebuild the containers
down:
	@echo "Stopping containers..."
	docker compose -f $(COMPOSE_FILE) down

# Clean up (stop containers and remove volumes)
clean:
	@echo "Cleaning up containers and volumes..."
	docker compose -f $(COMPOSE_FILE) down -v

# Clean everything (remove containers, volumes, networks, and images)
clean-all: clean-cache
	@echo "Cleaning up containers, volumes, networks, and images..."
	docker compose -f $(COMPOSE_FILE) down --volumes --remove-orphans --rmi all

# View logs
logs:
	@echo "Displaying logs..."
	docker compose -f $(COMPOSE_FILE) logs -f

# Clean cache and volumes
clean-cache:
	@echo "Cleaning cache and volumes..."
	docker compose -f $(COMPOSE_FILE) down --volumes
	docker system prune -f