<?php
//debug output
ini_set('display_startup_errors', 1);
ini_set('display_errors', 1);
error_reporting(-1);
require_once __DIR__.'/../vendor/autoload.php';

$app = new Silex\Application();
$app['debug'] = true; //debug output

// ... definitions
$app->get('/getPersonById/{code}',function($code){
	$locd = "localhost";
	$user = "root"; #FTW :O
	$pass = "maria";
	$dbna = "LEIEDAL";

	//connect
	$db = new mysqli($locd, $user, $pass, $dbna);
	//query
	$stmt = $db->prepare("select id,code,cemetery,type,dim1,dim2,dim3,dim4,familyName,firstName,dateOfDeath from DATA where code = ?");
	$stmt->bind_param('s',$code);
	$stmt->execute();

	//bind & fetch
	$stmt->bind_result($id,$code,$cemetery,$type,$dim1,$dim2,$dim3,$dim4,$familyName,$firstName,$dateOfDeath);
	$return = array();
	while($stmt->fetch()){
		//echo $id . " " . $code . "</br>";
	    array_push($return,array("id" => $id,
	    	"code" => $code, "cemetery" => $cemetery,
	    	"firstName" => $firstName, "familyName" => $familyName,
	    	"dateOfDeath" => $dateOfDeath));
	}

	//encode
	return json_encode($return);

	//close connection
	$stmt->close();
});

$app->get('/getPersonByName/{name}', function($name){
	$locd = "localhost";
	$user = "root"; #FTW :O
	$pass = "maria";
	$dbna = "LEIEDAL";

	//connect
	$db = new mysqli($locd, $user, $pass, $dbna);
	//query
	$stmt = $db->prepare("select id,code,cemetery,type,dim1,dim2,dim3,dim4,familyName,firstName,dateOfDeath from DATA
		where CONCAT (firstName, ' ', familyName) LIKE ? ");
		/*OR CONCAT(familyName , ' ' , firstName) LIKE ?
	");*/
	$name = "%" . $name . "%"; 
	$stmt->bind_param('s', $name);
//	$stmt->bind_param('s',$name);

	$stmt->execute();

	//bind & fetch
	$stmt->bind_result($id,$code,$cemetery,$type,$dim1,$dim2,$dim3,$dim4,$familyName,$firstName,$dateOfDeath);
	$return = array();
	while($stmt->fetch()){
		//echo $id . " " . $code . "</br>";
	    array_push($return,array("id" => $id,
	    	"code" => $code, "cemetery" => $cemetery,
	    	"firstName" => $firstName, "familyName" => $familyName,
	    	"dateOfDeath" => $dateOfDeath));
	}

	//encode
	return json_encode($return);

	//close connection
	$stmt->close();
});


$app->run();