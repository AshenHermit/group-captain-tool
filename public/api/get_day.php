<?php
require_once __DIR__.'/../../api/connect.php';

$mysqli = new mysqli($host, $user, $password, $database);
if ($mysqli->connect_errno) {
    echo "cant connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
}
mysqli_set_charset($mysqli, "utf8");

$q = "SELECT * FROM mirea_groups_day_data WHERE group_name='" . $_GET['group_name'] . "' AND day_timestamp=" . $_GET['day_timestamp'] . "";
$res = $mysqli->query($q) or die("Error " . mysqli_error($mysqli));
if($res){
    $row = mysqli_fetch_row($res);
    if($row){
        echo $row[3];
    }else{
        echo '{"result": "fuck, error", "error": "cant fetch row"}';
    } 
}else{
    echo '{"result": "fuck, error", "error": "invalid request"}';
}

?>