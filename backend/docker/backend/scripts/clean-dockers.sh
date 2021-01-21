#!/bin/bash
docker stop backend_crawler_1
docker stop backend_postgres_1
docker stop backend_graphql-engine_1

docker rm backend_crawler_1
docker rm backend_postgres_1
docker rm backend_graphql-engine_1

docker rmi backend:latest

docker volume rm backend_db-data

