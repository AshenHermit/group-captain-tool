<?php
ini_set('display_errors', 1); error_reporting(-1); 

require_once __DIR__.'/../../api/connect.php';
require __DIR__.'/../../api/get_valid_user.php';

$valid = false;
$user_data = get_valid_user($_POST['username'], $_POST['password']);
if(is_string($user_data)){

}else{
    // is mirea group captain
    if($user_data[5] == $_POST['group_name'] || $user_data[5] == "__all__"){
        $valid = true;
    }
}

$mysqli = new mysqli($host, $user, $password, $database);
if ($mysqli->connect_errno) {
    echo "cant connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
}
mysqli_set_charset($mysqli, "utf8");

function has_day_row($mysqli, $groupName, $dayTimestamp){
    $q = "SELECT * FROM mirea_groups_day_data WHERE group_name='" . $groupName . "' AND day_timestamp=" . $dayTimestamp . "";
    $res = $mysqli->query($q) or die("Error " . mysqli_error($mysqli));
    if($res){
        return $res->num_rows > 0;
    }else{
        return false;
    }
}

if($valid){
    if(has_day_row($mysqli, $_POST['group_name'], $_POST['day_timestamp'])){
        $q = "UPDATE mirea_groups_day_data SET json='" . $_POST["data"] . "' WHERE group_name='" . $_POST["group_name"] . "' AND day_timestamp=" . $_POST["day_timestamp"] . "";
        $res = $mysqli->query($q) or die('Error ' . mysqli_error($mysqli));
        echo '{"result": "successfully"}';
    }else{
        $q = "INSERT INTO mirea_groups_day_data(group_name, day_timestamp, json) VALUES ('" . $_POST["group_name"] . "', " . $_POST["day_timestamp"] . ", '" . $_POST["data"] . "')";
        $res = $mysqli->query($q) or die('Error ' . mysqli_error($mysqli));
        echo '{"result": "successfully"}';
    }
}
else{
    echo `{"result": "error: ", "error": "stop right there, criminal scum, you need to login before doing some mess"}`;
}
?>