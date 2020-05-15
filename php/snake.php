<?php

$connection = @mysql_connect('localhost', 'root', '');
$db = @mysql_select_db('snake', $connection);


$snake = new Snake();
if(isset($_GET['a'])){
    $snake->$_GET['a']();
}
class Snake {
    public function save(){
        $sql = mysql_query("SELECT * FROM `snake` WHERE `ip`='".$_SERVER['REMOTE_ADDR']."'");
        if($sql && mysql_num_rows($sql)>0){
            $row = mysql_fetch_array($sql);

            $wynik = mysql_query("UPDATE `snake` SET
              `ogon`='".mysql_real_escape_string($_POST['ogon'])."',
              `kierunek`='".mysql_real_escape_string($_POST['kierunek'])."',
              `punkty`='".mysql_real_escape_string($_POST['punkty'])."',
              `end`=".$_POST['end']."
            WHERE `id`='".$row['id']."'");
        } else {
            $wynik = mysql_query("INSERT INTO `snake` (`id`,`ip`,`ogon`,`kierunek`,`punkty`,`end`) 
            VALUES (NULL,'".$_SERVER['REMOTE_ADDR']."','".mysql_real_escape_string($_POST['ogon'])."','".mysql_real_escape_string($_POST['kierunek'])."','".mysql_real_escape_string($_POST['punkty'])."',".$_POST['end']." )");
        }
        if($wynik) echo 'ok'; else echo 'nie ok';
    }
    public function load(){
        $sql = mysql_query("SELECT * FROM `snake` WHERE `ip`='".$_SERVER['REMOTE_ADDR']."'");
        if($sql && mysql_num_rows($sql)>0) {
            $row = mysql_fetch_array($sql);
            echo json_encode(['ogon'=>$row['ogon'],'kierunek'=>$row['kierunek'], 'punkty'=>$row['punkty'], 'end'=>$row['end']]);
        } else echo 'nieok';
    }
}
mysql_close($connection);
?>