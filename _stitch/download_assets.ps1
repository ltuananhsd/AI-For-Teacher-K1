$ids = @("368cfd65e80c441d98785c1dccc7bd88", "4a76bfeef7dc46d5b664d37df737c5a4", "657105a38bbb4d0abebf26e65f7f20a8", "8a133fcb812540aa8225e438b84ffda2", "9435974d541846cebbd13ed8c55a9799")
foreach ($id in $ids) {
    if (Test-Path "$id.json") {
        $data = Get-Content "$id.json" | ConvertFrom-Json
        if ($data.htmlCode.downloadUrl) {
            Write-Host "Downloading HTML for $id..."
            curl.exe -s -L -o "${id}.html" $data.htmlCode.downloadUrl
        }
        if ($data.screenshot.downloadUrl) {
            Write-Host "Downloading PNG for $id..."
            curl.exe -s -L -o "${id}.png" $data.screenshot.downloadUrl
        }
    }
}
Write-Host "Done"
