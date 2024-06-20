<?php
    include("./myClass.php");
    session_start();
    $quality = 0;
    if(isset($_POST['id']) &&  isset($_POST['quality']) && isset($_POST['min']) && isset($_POST['max']) && isset($_SESSION['id']) )
    {
        $id = $_POST['id'];
        $quality = $_POST['quality'];
        $min = $_POST['min'];
        $max = $_POST['max'];
        foreach($_SESSION['id'] as $item )//for lấy từng sp trong giỏ
        {
            if($item->id == $id) //so sánh vs id sp cần cập nhật số lượng
            {

                $checkQty = $item->quality + $quality;
                if($checkQty >= $min  && $checkQty <= $max) //nếu còn đủ số lượng trong kho thì update lại số lượng
                {
                    $item->upQuality($quality);
                }
                echo $checkQty;
                exit;
            }
        }
    }

    
?>