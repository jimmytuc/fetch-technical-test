ifndef env
	env=development
endif
up:
	docker-compose -f development.yml up --build -d
stop:
	docker-compose -f development.yml stop
down:
	docker-compose -f development.yml down
