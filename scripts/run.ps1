$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$phpDirectory = 'C:\laragon\bin\php\php-8.2.29-nts-Win32-vs16-x64'
$logDirectory = Join-Path $root '.runtime'

$env:Path = "$phpDirectory;$env:Path"
New-Item -ItemType Directory -Force -Path $logDirectory | Out-Null

function Test-PortOpen($port) {
    return [bool](Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue | Where-Object { $_.LocalPort -eq $port })
}

if (-not (Test-PortOpen 8000)) {
    Start-Process -FilePath (Join-Path $phpDirectory 'php.exe') -ArgumentList 'artisan','serve','--host=127.0.0.1','--port=8000' -WorkingDirectory (Join-Path $root 'backend') -WindowStyle Hidden -RedirectStandardOutput (Join-Path $logDirectory 'backend.out.log') -RedirectStandardError (Join-Path $logDirectory 'backend.error.log')
}

if (-not (Test-PortOpen 5173)) {
    Start-Process -FilePath 'npm.cmd' -ArgumentList 'run','dev','--','--host','127.0.0.1','--port','5173','--strictPort' -WorkingDirectory (Join-Path $root 'frontend') -WindowStyle Hidden -RedirectStandardOutput (Join-Path $logDirectory 'frontend.out.log') -RedirectStandardError (Join-Path $logDirectory 'frontend.error.log')
}

Write-Host 'Backend:  http://127.0.0.1:8000'
Write-Host 'Frontend: http://127.0.0.1:5173'
Write-Host 'Database: PostgreSQL 17 pgAdmin 127.0.0.1:5434/lms'
Write-Host 'Log:      .runtime/'
