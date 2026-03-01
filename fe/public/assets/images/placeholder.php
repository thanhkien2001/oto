<?php
// Simple placeholder image generator
header('Content-Type: image/png');

$width = isset($_GET['w']) ? (int)$_GET['w'] : 400;
$height = isset($_GET['h']) ? (int)$_GET['h'] : 300;

$img = imagecreatetruecolor($width, $height);
$bg_color = imagecolorallocate($img, 233, 236, 239);
$text_color = imagecolorallocate($img, 108, 117, 125);

imagefill($img, 0, 0, $bg_color);
$text = 'No Image';
$font_size = 5;
$x = ($width - imagefontwidth($font_size) * strlen($text)) / 2;
$y = ($height - imagefontheight($font_size)) / 2;
imagestring($img, $font_size, $x, $y, $text, $text_color);

imagepng($img);
imagedestroy($img);
?>
