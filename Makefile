ifndef env
	env=development
endif

up:
	docker-compose -f compose-services-dev.yml up --build -d
stop:
	docker-compose -f compose-services-dev.yml stop
down:
	docker-compose -f compose-services-dev.yml down
test:
	docker-compose -f compose-services-dev.yml rm -f
	docker-compose -f compose-services-test.yml rm -f
	docker-compose -f compose-services-test.yml up --build
