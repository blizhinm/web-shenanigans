<?php
	$player_score = $_POST['score'];
	$dif = $_POST['difficulty'];
	$file_best_score = file("bestscore.txt",FILE_IGNORE_NEW_LINES);
	if($player_score > $file_best_score[$dif]){
		$file_best_score[$dif] = $player_score;
		file_put_contents('bestscore.txt', implode(PHP_EOL,$file_best_score));
	}
?>
