<?php
//debug output
ini_set('display_startup_errors', 1);
ini_set('display_errors', 1);
error_reporting(-1);
require_once __DIR__.'/../vendor/autoload.php';

$app = new Silex\Application();
$app['debug'] = true; //debug output

//settings
$locd = "localhost";
$user = "root"; #FTW :O
$pass = "maria";
$dbna = "LEIEDAL";

//Person
//ID
//Get a person by id at all cemeteries
$app->get('/getPersonByCode/{code}',function($code) use($locd,$user,$pass,$dbna){
	//connect
	$db = new mysqli($locd, $user, $pass, $dbna);
	//query
	//municipality,
	$stmt = $db->prepare("select id,code,municipality,cemetery,type,dim1,dim2,dim3,dim4,familyName,firstName,dateOfDeath 
		from DATA where code = ?");
	$stmt->bind_param('s',$code);
	$stmt->execute();

	//bind & fetch
	$stmt->bind_result($id,$code,$municipality,$cemetery,$type,$dim1,$dim2,$dim3,$dim4,$familyName,$firstName,$dateOfDeath);
	$return = array();
	while($stmt->fetch()){
	    array_push($return,array("id" => $id,
	    	"code" => $code, "municipality" => $municipality,
	    	"cemetery" => $cemetery,"type" => $type,
	    	"firstName" => $firstName, "familyName" => $familyName,
	    	"dateOfDeath" => $dateOfDeath));
	}

	//close connection
	$stmt->close();

	//encode
	return json_encode($return);
});

//Get a person by id at one cemetery
$app->get('/getPersonByCodeAtCemetery/{cemetery}/{code}',function($cemetery,$code) use($locd,$user,$pass,$dbna){
	//connect
	$db = new mysqli($locd, $user, $pass, $dbna);
	//query
	$stmt = $db->prepare("select id,code,municipality,cemetery,type,dim1,dim2,dim3,dim4,familyName,firstName,dateOfDeath 
		from DATA where code = ? AND cemetery = ?");
	$stmt->bind_param('ss',$code,$cemetery);
	$stmt->execute();

	//bind & fetch
	$stmt->bind_result($id,$code,$municipality,$cemetery,$type,$dim1,$dim2,$dim3,$dim4,$familyName,$firstName,$dateOfDeath);
	$return = array();
	while($stmt->fetch()){
	    array_push($return,array("id" => $id,
	    	"code" => $code, "municipality" => $municipality, 
	    	"cemetery" => $cemetery, "type" => $type,
	    	"firstName" => $firstName, "familyName" => $familyName,
	    	"dateOfDeath" => $dateOfDeath));
	}

	//close connection
	$stmt->close();

	//encode
	return json_encode($return);
});

//NAME
//Get a person by name at all cemeteries
$app->get('/getPersonByName/{name}', function($name) use($locd,$user,$pass,$dbna){
	//connect
	$db = new mysqli($locd, $user, $pass, $dbna);
	//query
	$stmt = $db->prepare("select id,code,municipality,cemetery,type,dim1,dim2,dim3,dim4,familyName,firstName,dateOfDeath from DATA
		where CONCAT (firstName, ' ', familyName) LIKE ? 
		OR CONCAT(familyName , ' ' , firstName) LIKE ?
	");
	$name = "%" . $name . "%"; 
	$stmt->bind_param('ss', $name, $name);

	$stmt->execute();

	//bind & fetch
	$stmt->bind_result($id,$code,$municipality,$cemetery,$type,$dim1,$dim2,$dim3,$dim4,$familyName,$firstName,$dateOfDeath);
	$return = array();
	while($stmt->fetch()){
		//echo $id . " " . $code . "</br>";
	    array_push($return,array("id" => $id,
	    	"code" => $code, "municipality" => $municipality, 
	    	"cemetery" => $cemetery, "type" => $type,
	    	"firstName" => $firstName, "familyName" => $familyName,
	    	"dateOfDeath" => $dateOfDeath));
	}

	//close connection
	$stmt->close();

	//encode
	return json_encode($return);
});

//Get a person by name at one cemetery
$app->get('/getPersonByNameAtCemetery/{cemetery}/{name}', function($cemetery,$name) use($locd,$user,$pass,$dbna){
	//connect
	$db = new mysqli($locd, $user, $pass, $dbna);
	//query
	$stmt = $db->prepare("select id,code,municipality,cemetery,type,dim1,dim2,dim3,dim4,familyName,firstName,dateOfDeath from DATA
		where cemetery = ? AND 
			(CONCAT (firstName, ' ', familyName) LIKE ? OR CONCAT(familyName , ' ' , firstName) LIKE ? )
	");
	$name = "%" . $name . "%"; 
	$stmt->bind_param('sss', $cemetery, $name, $name);

	$stmt->execute();

	//bind & fetch
	$stmt->bind_result($id,$code,$municipality,$cemetery,$type,$dim1,$dim2,$dim3,$dim4,$familyName,$firstName,$dateOfDeath);
	$return = array();
	while($stmt->fetch()){
		//echo $id . " " . $code . "</br>";
	    array_push($return,array("id" => $id,
	    	"code" => $code, "cemetery" => $cemetery,
	    	"municipality" => $municipality, "type" => $type,
	    	"firstName" => $firstName, "familyName" => $familyName,
	    	"dateOfDeath" => $dateOfDeath));
	}

	//close connection
	$stmt->close();

	//encode
	return json_encode($return);
});


//cemetery
//Get the distinct cemeteries
$app->get('/getCemeteries', function() use($locd,$user,$pass,$dbna){
	//connect
	$db = new mysqli($locd, $user, $pass, $dbna);
	//query
	$res = $db->query("select distinct cemetery from DATA"); 

	$return = array();
	while($row = $res->fetch_assoc()){
	    array_push($return,$row['cemetery']);
	}

	//encode
	return json_encode($return);
});



$app->run();