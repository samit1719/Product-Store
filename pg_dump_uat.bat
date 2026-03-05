@echo off
setlocal enabledelayedexpansion

:: Configuration
set pgHost=10.10.10.10
set pgUser=postgres
set pgPort=5432
set backupDir=E:\backup_dir\Database_backup_uat
set customPgPassPath=C:\pgpass\pgpass_uat.conf
set logDir=E:\backup_dir\UAT_Backup_Logs

:: Create log directory if missing
if not exist "%logDir%" (
    echo Creating log directory...
    mkdir "%logDir%"
    if errorlevel 1 (
        echo Error: Failed to create log directory
        exit /b 1
    )
)

:: Generate timestamp for log file
for /f "tokens=*" %%i in ('powershell -Command "Get-Date -Format 'yyyyMMdd'"') do set logDate=%%i
set logFile=%logDir%\backup_log_%logDate%.csv
echo Log file: !logFile!

:: Create log file header if it doesn't exist
if not exist "%logFile%" (
    echo Creating new log file with header...
    echo "StartTime","EndTime","Result","BackupFile","Checksum","ErrorMessage" > "%logFile%"
) else (
    echo Log file already exists
)

:: Initialize variables
for /f "tokens=*" %%i in ('powershell -Command "Get-Date -Format 'yyyy-MM-dd HH:mm:ss'"') do set startTime=%%i
set backupResult=FAIL
set errorMessage=
set fileChecksum=
set backupFile=

echo Start Time: !startTime!

:: Set environment variable for pgpass
set PGPASSFILE=%customPgPassPath%

:: Create backup directory if missing
if not exist "%backupDir%" (
    echo Creating backup directory...
    mkdir "%backupDir%"
    if errorlevel 1 (
        set "errorMessage=Failed to create backup directory"
        echo ERROR: !errorMessage!
        goto :LogResult
    )
)

:: Generate timestamp for backup file
for /f "tokens=*" %%i in ('powershell -Command "Get-Date -Format 'yyyyMMdd_HHmmss'"') do set timestamp=%%i
set "backupFile=%backupDir%\databases_%timestamp%.sql"
echo Backup file: !backupFile!

echo Starting pg_dumpall...
:: Run pg_dumpall
pg_dumpall -h %pgHost% -U %pgUser% -p %pgPort% -f "%backupFile%" --verbose
if errorlevel 1 (
    set "errorMessage=pg_dumpall failed with error code: !errorlevel!"
    echo ERROR: !errorMessage!
    goto :LogResult
)

echo pg_dumpall completed successfully.

:: Calculate checksum if backup succeeded
if exist "%backupFile%" (
    echo Calculating checksum...
    for /f "tokens=*" %%c in ('powershell -Command "Get-FileHash '%backupFile%' -Algorithm MD5 | Select-Object -ExpandProperty Hash" 2^>nul') do (
        set "fileChecksum=%%c"
    )
    if "!fileChecksum!"=="" (
        set "fileChecksum=CALCULATION_FAILED"
    )
    echo Checksum: !fileChecksum!
) else (
    set "errorMessage=Backup file was not created"
    set "fileChecksum=FILE_NOT_FOUND"
    echo ERROR: !errorMessage!
    goto :LogResult
)

set "backupResult=SUCCESS"
echo Backup result: SUCCESS

:LogResult
:: Get end time
for /f "tokens=*" %%i in ('powershell -Command "Get-Date -Format 'yyyy-MM-dd HH:mm:ss'"') do set endTime=%%i
echo End Time: !endTime!

:: Display what will be written to log
echo.
echo === LOG ENTRY TO BE WRITTEN ===
echo StartTime: !startTime!
echo EndTime: !endTime!
echo Result: !backupResult!
echo BackupFile: !backupFile!
echo Checksum: !fileChecksum!
echo ErrorMessage: !errorMessage!
echo ===============================
echo.

:: Write to log file
echo Writing to log file...
echo "!startTime!","!endTime!","!backupResult!","!backupFile!","!fileChecksum!","!errorMessage!" >> "!logFile!"

:: Check if write was successful
if errorlevel 1 (
    echo ERROR: Failed to write to log file!
    echo Please check permissions on: !logFile!
) else (
    echo SUCCESS: Log entry written to !logFile!
    
    :: Verify the write by showing last line of log file
    echo Verifying log entry...
    for /f "usebackq delims=" %%x in ("!logFile!") do set "lastLine=%%x"
    echo Last line in log: !lastLine!
)


echo Cleaning up backups older than 1 day...
set count=0

:: Get cutoff date in YYYY-MM-DD format
for /f "tokens=*" %%d in ('powershell -Command "(Get-Date).AddDays(-1).ToString('yyyy-MM-dd')"') do set cutoffDate=%%d

echo Cutoff date: !cutoffDate!

:: Process files with PowerShell
for /f "tokens=*" %%F in ('powershell -Command "Get-ChildItem '%backupDir%\databases_*.sql' | Where-Object { $_.LastWriteTime -lt [datetime]'%cutoffDate%' } | Select-Object -ExpandProperty FullName"') do (
    echo Deleting old backup: %%F
    del "%%F"
    if errorlevel 1 (
        echo Warning: Failed to delete %%F - continuing with other files
    ) else (
        set /a count+=1
    )
)

if !count! gtr 0 (
    echo Successfully deleted !count! old backup(s).
) else (
    echo No backups older than 1 day found.
)

:: Final exit
if "!backupResult!"=="SUCCESS" (
    echo Backup completed successfully.
    endlocal
    exit /b 0
) else (
    echo Backup failed.
    endlocal
    exit /b 1
)