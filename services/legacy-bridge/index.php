<?php
// M5-L10: PHP Wrappers (php://filter)
// M5-L11: Path Traversal
$module = $_GET['module'] ?? 'dashboard';
include("includes/" . $module . ".php");
?>
