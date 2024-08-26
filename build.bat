@echo off

REM Variables
set TEMP_DB_CONTAINER_NAME=temp_pg_db
set TEMP_DB_NAME=temp_db
set TEMP_DB_USER=temp_user
set TEMP_DB_PASSWORD=temp_pass
set DOCKER_IMAGE_NAME=ozoneteam/loop-in:latest

REM Function to check if a port is available
:check_port
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :%1') do (
    tasklist /fi "PID eq %%a" | findstr /i "postgres.exe" >nul
    if not errorlevel 1 (
        echo Port %1 is in use.
        exit /b 1
    )
)
exit /b 0

REM Step 1: Find an available random port
:find_port
for /l %%x in (1, 1, 1000) do (
    set /a TEMP_DB_PORT=%random% + 1024
    call :check_port %TEMP_DB_PORT%
    if not errorlevel 1 (
        echo Selected port %TEMP_DB_PORT% is available.
        goto start_container
    )
    echo Port %TEMP_DB_PORT% is in use, trying another port...
)
goto find_port

REM Step 2: Start a temporary PostgreSQL database container with the available port
:start_container
echo Starting temporary PostgreSQL container on port %TEMP_DB_PORT%...
docker run --name %TEMP_DB_CONTAINER_NAME% --rm -e POSTGRES_DB=%TEMP_DB_NAME% -e POSTGRES_USER=%TEMP_DB_USER% -e POSTGRES_PASSWORD=%TEMP_DB_PASSWORD% -p %TEMP_DB_PORT%:5432 -d postgres

REM Step 3: Wait for PostgreSQL to be ready
echo Waiting for PostgreSQL to be ready...
:wait_for_pg
docker exec %TEMP_DB_CONTAINER_NAME% pg_isready -U %TEMP_DB_USER% -d %TEMP_DB_NAME% >nul
if errorlevel 1 (
    timeout /t 1 >nul
    goto wait_for_pg
)

REM Step 4: Build the Next.js app with Docker, passing the PostgreSQL connection details
echo Building Next.js app Docker image...
docker build --build-arg DATABASE_URL=postgresql://%TEMP_DB_USER%:%TEMP_DB_PASSWORD%@host.docker.internal:%TEMP_DB_PORT%/%TEMP_DB_NAME% -t %DOCKER_IMAGE_NAME% .

REM Step 5: Stop and remove the temporary PostgreSQL container
echo Cleaning up temporary PostgreSQL container...
docker stop %TEMP_DB_CONTAINER_NAME%

echo Build complete. Docker image %DOCKER_IMAGE_NAME% is ready.