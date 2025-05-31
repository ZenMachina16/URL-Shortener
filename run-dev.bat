@echo off
echo Starting URL Shortener Development Environment...

start cmd /k "echo Starting Go Backend... && go run main.go"
start cmd /k "echo Starting Next.js Frontend... && cd frontend && npm run dev"
 
echo Development environment started:
echo - Backend: http://localhost:9808
echo - Frontend: http://localhost:3000 