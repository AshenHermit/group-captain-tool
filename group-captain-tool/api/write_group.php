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

function has_group_row($mysqli, $groupName){
    $q = "SELECT * FROM mirea_groups WHERE group_name='" . $groupName . "'";
    $res = $mysqli->query($q) or die("Error " . mysqli_error($mysqli));
    if($res){
        return $res->num_rows > 0;
    }else{
        return false;
    }
}

if($valid){
    if(has_group_row($mysqli, $_POST["group_name"])){
        $q = "UPDATE mirea_groups SET json='" . $_POST["data"] . "' WHERE group_name='" . $_POST["group_name"] . "'";
        $res = $mysqli->query($q) or die("Error " . mysqli_error($mysqli));
        echo '{"result": "successfully"}';
    }else{
        $q = "INSERT INTO mirea_groups(group_name, json) VALUES ('" . $_POST["group_name"] . "', '" . $_POST["data"] . "')";
        $res = $mysqli->query($q) or die("Error " . mysqli_error($mysqli));
        echo '{"result": "successfully"}';
    }
}
else{
    echo '{"result": "error: ", "error": "stop right there, criminal scum, you need to login before doing some mess"}';
}
?>