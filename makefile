PYTHON=python3
VENV_DIR=venv
BACK_DIR=back
FRONT_DIR=front
REQUIREMENTS=$(BACK_DIR)/requirements.txt
ACTIVATE=$(VENV_DIR)/bin/activate

.PHONY: venv install runserver clean source all front

venv:
	$(PYTHON) -m venv $(VENV_DIR)
	@echo "Virtual environment created in $(VENV_DIR)"

install: venv
	/bin/bash -c "source $(ACTIVATE) && $(VENV_DIR)/bin/pip install -r $(REQUIREMENTS)"
	@echo "Dependencies installed from $(REQUIREMENTS)"

runserver: install
	/bin/bash -c "source $(ACTIVATE) && cd $(BACK_DIR) && ../$(VENV_DIR)/bin/python manage.py runserver"
	@echo "Django development server is running"

source:
	@echo "Run the following command to activate the virtual environment:"
	@echo "source $(ACTIVATE)"

front:
	cd $(FRONT_DIR) && npm install && npm run dev
	@echo "Frontend started successfully"



back: venv install runserver


