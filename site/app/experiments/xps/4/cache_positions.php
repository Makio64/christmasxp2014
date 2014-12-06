<?php

$path = $_POST['path'];
$json = $_POST['json'];

// print_r($path);
// print_r($json);

file_put_contents($path, json_decode(json_encode($json)));

$arr = array(
	'status'=>'success'
);

echo json_encode($arr);