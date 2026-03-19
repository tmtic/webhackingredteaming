<?php
// M5-L10: PHP Wrappers (php://filter)
// M5-L11: PHP Path Traversal
$page = $_GET['module'];
if(isset($page)) {
    include("modules/" . $page . ".php");
}
?>
