<?php
//debug output
ini_set('display_startup_errors', 1);
ini_set('display_errors', 1);
error_reporting(-1);
require_once __DIR__.'/vendor/autoload.php';

$app = new Silex\Application();
$app['debug'] = true; //debug output

//settings
$locd = "localhost";
$user = "root"; #FTW :O
$pass = "root";
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
	    	"code" => htmlentities($code), "municipality" => htmlentities($municipality),
	    	"cemetery" => htmlentities($cemetery),"type" => htmlentities($type),
	    	"firstName" => htmlentities($firstName), "familyName" => htmlentities($familyName),
	    	"dateOfDeath" => htmlentities($dateOfDeath)));
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
	    	"code" => htmlentities($code), "municipality" => htmlentities($municipality),
	    	"cemetery" => htmlentities($cemetery), "type" => htmlentities($type),
	    	"firstName" => htmlentities($firstName), "familyName" => htmlentities($familyName),
	    	"dateOfDeath" => htmlentities($dateOfDeath)));
	}

	//close connection
	$stmt->close();

	//encode
	return json_encode($return);
});

//NAME (& year of death)
//Get a person by name at all cemeteries
$app->get('/getPersonByName/{name}', function($name) use($locd,$user,$pass,$dbna){
	//connect
	$db = new mysqli($locd, $user, $pass, $dbna);
	//echo "s: $name</br>";
	//get name and year
	if (preg_match('/[0-9]{1,4}/',$name,$year, PREG_OFFSET_CAPTURE )){
		//echo var_dump($year) . "</br>";
		//prep query
		$stmt = $db->prepare("select id,code,municipality,cemetery,type,dim1,dim2,dim3,dim4,familyName,firstName,dateOfDeath from DATA
			where ( CONCAT (firstName, ' ', familyName) LIKE ?
				OR CONCAT(familyName , ' ' , firstName) LIKE ? )
			AND year(dateOfDeath) LIKE ?
		");
		
		//prep params
		$name = preg_replace('/\d/','',$name); //remove all digits in name
		$name = trim($name) . "%";//name starts with 

		$year = "%" . $year[0][0] . "%";//only the first year && contain

		//echo "y: $year </br>n: $name</br>";
		//bind params
		$stmt->bind_param('sss', $name, $name, $year); //only 
	}else{
		//prep query
		$stmt = $db->prepare("select id,code,municipality,cemetery,type,dim1,dim2,dim3,dim4,familyName,firstName,dateOfDeath from DATA
			where ( CONCAT (firstName, ' ', familyName) LIKE ?
				OR CONCAT(familyName , ' ' , firstName) LIKE ? )
		");
		
		$name = trim($name) . "%";//name starts with

		//bind params
		$stmt->bind_param('ss', $name, $name);
	}

	//execute
	$stmt->execute();

	//bind results & fetch
	$stmt->bind_result($id,$code,$municipality,$cemetery,$type,$dim1,$dim2,$dim3,$dim4,$familyName,$firstName,$dateOfDeath);
	$return = array();
	$i = 0;
	while($stmt->fetch()){
		//echo $id . " " . $code . "</br>";
	    array_push($return,array("id" => $id,
	    	"code" => htmlentities($code), "municipality" => htmlentities($municipality),
	    	"cemetery" => htmlentities($cemetery), "type" => htmlentities($type),
	    	"firstName" => htmlentities($firstName), "familyName" => htmlentities($familyName),
	    	"dateOfDeath" => htmlentities($dateOfDeath)));
			$i++;
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
	//echo "s: $name</br>";
	//get name and year
	if (preg_match('/[0-9]{1,4}/',$name,$year, PREG_OFFSET_CAPTURE )){
		//echo var_dump($year) . "</br>";
		//prep query
		$stmt = $db->prepare("select id,code,municipality,cemetery,type,dim1,dim2,dim3,dim4,familyName,firstName,dateOfDeath from DATA
			where ( CONCAT (firstName, ' ', familyName) LIKE ?
				OR CONCAT(familyName , ' ' , firstName) LIKE ? )
			AND year(dateOfDeath) LIKE ?
			AND cemetery = ?
		");
		
		//prep params
		$name = preg_replace('/\d/','',$name); //remove all digits in name
		$name = trim($name) . "%";//name starts with 

		$year = "%" . $year[0][0] . "%";//only the first year && contain

		//echo "y: $year </br>n: $name</br>";
		//bind params
		$stmt->bind_param('ssss', $name, $name, $year, $cemetery); //only 
	}else{
		//prep query
		$stmt = $db->prepare("select id,code,municipality,cemetery,type,dim1,dim2,dim3,dim4,familyName,firstName,dateOfDeath from DATA
			where ( CONCAT (firstName, ' ', familyName) LIKE ?
				OR CONCAT(familyName , ' ' , firstName) LIKE ? )
			AND cemetery = ?
		");
		
		$name = trim($name) . "%";//name starts with

		//bind params
		$stmt->bind_param('sss', $name, $name, $cemetery);
	}

	$stmt->execute();

	//bind & fetch
	$stmt->bind_result($id,$code,$municipality,$cemetery,$type,$dim1,$dim2,$dim3,$dim4,$familyName,$firstName,$dateOfDeath);
	$return = array();
	while($stmt->fetch()){
		//echo $id . " " . $code . "</br>";
	    array_push($return,array("id" => $id,
	    	"code" => htmlentities($code), "cemetery" => htmlentities($cemetery),
	    	"municipality" => htmlentities($municipality), "type" => htmlentities($type),
	    	"firstName" => htmlentities($firstName), "familyName" => htmlentities($familyName),
	    	"dateOfDeath" => htmlentities($dateOfDeath)));
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
