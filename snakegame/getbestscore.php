<?php
	$dif = $_POST['difficulty'];
	$bestscore = file('bestscore.txt');

	echo $bestscore[$dif];
?>