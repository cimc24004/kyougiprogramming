param([string]$StateDirectory = (Join-Path $PSScriptRoot 'runtime'))
$ErrorActionPreference = 'Stop'
$stateFile = Join-Path $StateDirectory 'bridge-state.json'
if (!(Test-Path -LiteralPath $stateFile)) { Write-Output 'AlgoDojo Codex is not running from this folder.'; exit 0 }
$state = Get-Content -LiteralPath $stateFile -Raw | ConvertFrom-Json
$targetProcess = Get-CimInstance Win32_Process -Filter "ProcessId = $([int]$state.pid)"
if ($targetProcess -and $targetProcess.Name -eq 'node.exe' -and $targetProcess.CommandLine.Contains([string]$state.script)) {
  Stop-Process -Id ([int]$state.pid)
  Remove-Item -LiteralPath $stateFile
  Write-Output 'AlgoDojo Codex stopped.'
} else { Write-Output 'The saved process is no longer running.' }
