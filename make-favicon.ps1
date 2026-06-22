Add-Type -AssemblyName System.Drawing

$sourcePath = "C:\Users\wogus\.gemini\antigravity\brain\0bfeaf4b-66c4-4dc0-b516-0ed92c084001\media__1782107080628.jpg"
$img = [System.Drawing.Image]::FromFile($sourcePath)

function ResizeAndSave($width, $height, $filename) {
    $bmp = New-Object System.Drawing.Bitmap($width, $height)
    $graph = [System.Drawing.Graphics]::FromImage($bmp)
    $graph.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graph.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graph.DrawImage($img, 0, 0, $width, $height)
    
    $fullPath = Join-Path $PWD.Path $filename
    $bmp.Save($fullPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    $graph.Dispose()
    $bmp.Dispose()
}

ResizeAndSave 192 192 "favicon.png"
ResizeAndSave 180 180 "apple-touch-icon.png"
ResizeAndSave 32 32 "favicon-32x32.png"

$img.Dispose()
