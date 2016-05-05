<?php
set_time_limit (0); //don't timeout on big queries
//show errors 
ini_set('display_errors',1);
error_reporting(E_ALL);

//connect to the database
$db_connection = pg_connect("host=localhost dbname=wooden_ships user=scottsfarley password=xP73m3YAb1"); // geography grad server
//user scottsfarley has all permissions on this database
if (!$db_connection){
	die("Could not connect to database: ".pg_errormessage($db_connection));
}else{
}
//all requests are GET requests -- > don't try to use POST 
// 
// header=False, logbookLanguage = "", voyageFrom = "", voyageTo = "", shipName = "", shipType = "", company = "", nationality = "",
            // name1= "", year = "", month = "", day = "", lat = "", lng = "", obsGen = False, cargo = False, biology=False,
            // warsAndFights=False, otherObs=False, illustrations=False, shipsAndRig=False, lifeOnBoard=False,
            // anchored = False, windDirection = "", windForce="", weather="", shapeClouds= "", dirClouds="", clearness="",
            // precipitationDescriptor="", gusts=False, rain=False, fog=False, snow=False, thunder=False, hail=False, seaice=False,
            // minYear="", maxYear="", minMonth="", maxMonth="", minDay="", maxDay="", latN="", latS = "", lngE="", lngW="", weatherCodeNotNull=False,
            // fieldlist="", callback="", windSpeedMax = "", windDirMax = "",windSpeedMin="", windDirMin = "", join=False, *args, **kwargs):


$sql = "SET statement_timeout TO 100000000;";
$result = pg_query($sql);         
//start building the sql
$sql = "SELECT Count(DISTINCT(togeocode)) FROM logs WHERE ";

$colnames = array("place");

//what was the ships name?
if (isset($_GET['shipName'])){
	$shipname = $_GET['shipName'];
	if ($shipname != ""){
	$sql .= " shipname='" . $shipname ."' AND ";		
	}
}
//ship type
if(isset($_GET['shipType'])){
	if ($_GET['shipType'] != ""){
		$sql .= " shiptype='". $_GET['shipType'] . "' AND ";		
	}
}
//company
if(isset($_GET['company'])){
	if ($_GET['company'] != ""){
		$sql .= " company='" . $_GET['company']."' AND ";		
	}
}
//nationality
if(isset($_GET['nationality'])){
	if ($_GET['nationality'] != ""){$sql .= " nationality='" . $_GET['nationality'] . "' AND ";}
}
//name of captain/first officer
if (isset($_GET['name1'])){
	if($_GET['name1'] != ""){$sql .= " name1='" . $_GET['name1'] . "' AND ";}
}
//year of voyage
if(isset($_GET['year'])){
	if($_GET['year'] != ""){$sql .= " year=" . $_get['year'] . " AND ";}
}

//month of voyage
if(isset($_GET['month'])){
	if($_GET['month'] != ""){$sql = " month=" . $_GET['month'] . " AND ";}
}
//day of voyage --> kind of useless but why not add it anyways
if(isset($_GET['day'])){
	if($_GET['day'] != ""){$sql = " day=" . $_GET['day'] . " AND ";}
}
//exact position
if(isset($_GET['lat'])){
	if($_GET['lat'] != ""){
		$sql .= " lat3=" . $_GET['lat'] . " AND ";
	}
}
if(isset($_GET['lng'])){
	if($_GET['lng'] != ""){
		$sql .= " lon3=" . $_GET['lng']. " AND ";
	}
}
// //filter by observations 
if (isset($_GET['obsGen'])){
	if( ($_GET['obsGen'] == "true") ){
		$sql .= " obsgen <> '' AND "; //not null
	}
}

//these are booleans
if(isset($_GET['cargo'])){
	if (($_GET['cargo'] == "true")){
		$sql .= " cargo = TRUE AND ";
	}else{
		$sql .= " cargo = FALSE AND ";
	}
}
//did the record include a biology memo?
if(isset($_GET['biology']) ){
	if ( ($_GET['biology'] == "true")){
		$sql .= " biology = TRUE AND ";
	}else{
		$sql .= " biology = FALSE AND ";
	}
}
//did the record have warsAndFights  memo?
if(isset($_GET['warsAndFights']) ){
	if ( ($_GET['warsAndFights'] == "true")){
		$sql .= " warsandfights = TRUE AND ";
	}else{
		$sql .= " warsandfights = FALSE AND ";
	}
}
// //did the record include any other  observations?
if(isset($_GET['otherObs'])){
	if ( ($_GET['otherObs'] == "true")){
		$sql .= ' otherrem = TRUE AND ';
	}else{
		$sql .= " otherrem = FALSE AND ";
	}
}

//did the record note illustrations?
if(isset($_GET['illustrations'])){
	if ( ($_GET['illustrations'] == "true")){
		$sql .= ' illustrations = TRUE AND ';
	}else{
		$sql .= " illustrations = FALSE AND ";
	}
}
//did the record note anything about the ship?
if(isset($_GET['shipsAndRig'])){
	if ( ($_GET['shipsAndRig'] == "true")){
		$sql .= ' shipsandrig = TRUE AND ';
	}else{
		$sql .= " shipsandrig = FALSE AND ";
	}
}

//did the record note anything about life on the ship?
if(isset($_GET['lifeOnBoard'])){
	if ( ($_GET['lifeOnBoard'] == "true")){
		$sql .= ' lifeonboard = TRUE AND ';
	}else{
		$sql .= " lifeonboard = FALSE AND ";
	}
}

//was the ship anchored?
if(isset($_GET['anchored'])){
	if ( ($_GET['anchored'] == "true")){
		$sql .= ' anchored = TRUE AND ';
	}else{
		$sql .= " anchored = FALSE AND ";
	}
}
//query the text field of the wind direction in original language
if(isset($_GET['windDirection'])){
	if($_GET['windDirection'] != ""){
		$sql .= " winddirection ='" . $_GET['windDirection'] . "' AND ";
	}
}
//query the text field of the wind force in original language
if(isset($_GET['windForce'])){
	if($_GET['windForce'] != ""){
		$sql .= " windforce ='" . $_GET['windForce'] . "' AND ";
	}
}
// //query the text field of the weather
if(isset($_GET['weather'])){
	if($_GET['weather'] != ""){
		$sql .= " weather ='" . $_GET['weather'] . "' AND ";
	}
}
//query the text field for the shape of the clouds
if(isset($_GET['shapeClouds'])){
	if($_GET['shapeClouds'] != ""){
		$sql .= " shapeclouds ='" . $_GET['shapeClouds'] . "' AND ";
	}
}
//query the text field of the direction of the clouds
if(isset($_GET['dirClouds'])){
	if($_GET['dirClouds'] != ""){
		$sql .= " dirclouds ='" . $_GET['dirClouds'] . "' AND ";
	}
}

if(isset($_GET['clearness'])){
	if($_GET['clearness'] != ""){
		$sql .= " clearness ='" . $_GET['clearness'] . "' AND ";
	}
}

//text field about precipitation
if(isset($_GET['precipitationDescriptor'])){
	if($_GET['precipitationDescriptor'] != ""){
		$sql .= " precipitationdescriptor ='" . $_GET['precipitationDescriptor'] . "' AND ";
	}
}

//was it gusty?
if(isset($_GET['gusts'])){
	if ( ($_GET['gusts'] == "true")){
		$sql .= " gusts = TRUE AND ";
	}else{
		$sql .= " gusts = FALSE AND ";
	}
}

//rainy?
if(isset($_GET['rain'])){
	if ( ($_GET['rain'] == "true")){
		$sql .= " rain = TRUE AND ";
	}else{
		$sql .= " rain = FALSE AND ";
	}
}
//foggy?
if(isset($_GET['fog'])){
	if (boolval($_GET['fog']) || ($_GET['fog'] == "true")){
		$sql .= " fog = TRUE AND ";
	}else{
		$sql .= " fog = FALSE AND ";
	}
}
//snowy?
if(isset($_GET['snow'])){
	if ( ($_GET['snow'] == "true")){
		$sql .= " snow = TRUE AND ";
	}else{
		$sql .= " snow = FALSE AND ";
	}
}

//thundery?
if(isset($_GET['thunder']) ){
	if ( ($_GET['thunder'] == "true")){
		$sql .= " thunder = TRUE AND ";
	}else{
		$sql .= " thunder = FALSE AND ";
	}
}

//hailing?
if(isset($_GET['hail']) ){
	if (($_GET['hail'] == "true")){
		$sql .= ' hail = TRUE AND ';
	}else{
		$sql .= " hail = FALSE AND ";
	}
}
//sea ice noted?
if(isset($_GET['seaice']) ){
	if ( ($_GET['seaice'] == "true")){
		$sql .= ' seaice = TRUE AND ';
	}else{
		$sql .= " seaice = FALSE AND ";
	}
}

// //geographic query
if (isset($_GET['latN'])){
	if($_GET['latN'] != ""){
		$sql .= " lat3 <=" . $_GET['latN'] . " AND ";
	}
}
if(isset($_GET['latS'])){
	if($_GET['latS'] != ""){
		$sql .= " lat3 >=" . $_GET['latS'] . " AND ";
	}	
}
if(isset($_GET['lngE'])){
	if($_GET['lngE'] != ""){
		$sql .= " lon3 <=" . $_GET['lngE'] . " AND ";
	}	
}
if(isset($_GET['lngW'])){
	if($_GET['lngW'] != ""){
		$sql .= " lon3 >=" . $_GET['lngW'] . " AND ";
	}	
}

// //temporal search --> better than specifying year and month and day
if (isset($_GET['minYear'])){
	if ($_GET['minYear'] != ""){
		$minDate = $_GET['minYear'];
		if (isset($_GET['minMonth'])){
			if($_GET['minMonth'] != ""){
				$minDate .= "-" . $_GET['minMonth'];
				if (isset($_GET['minDay'])){
					if($_GET['minDay'] != ""){
						$minDate .= "-" . $_GET['minDay'];
					}else{
						$minDate .= "-01";
					}
				}
			}else{
				$minDate .= "-01";
			}
		}
		$sql .= " date >= CAST('" . $minDate . "' AS DATE) AND ";
	}
}
if (isset($_GET['maxYear'])){
	if ($_GET['maxYear'] != ""){
		$maxDate = $_GET['maxYear'];
		if (isset($_GET['maxMonth'])){
			if($_GET['maxMonth'] != ""){
				$maxDate .= "-" . $_GET['maxMonth'];
				if (isset($_GET['maxDay'])){
					if($_GET['maxDay'] != ""){
						$maxDate .= "-" . $_GET['maxDay'];
					}else{
						$maxDate .= "-01";
					}
				}
			}else{
				$maxDate .= "-01";
			}
		}
		$sql .= " date <= CAST('" . $maxDate . "' AS DATE) AND ";
	}
}
if (isset($_GET['weatherCodeNotNull'])){
	if(boolval($_GET['weatherCodeNotNull'])|| ($_GET['weatherCodeNotNull'] == "true")){
		$sql .= " weather <> '' AND ";
	}
}

if(isset($_GET['join'])){ //only query on these fields if we've done the join so it doesn't fail for not having that column
	if($_GET['join'] == "true"){
		if(isset($_GET['windSpeedMin'])){
			if($_GET['windSpeedMin'] != ""){
				$sql .= " CAST((COALESCE(mps,'0')) AS double precision) >= " . $_GET['windSpeedMin'] . " AND ";
			}
		}
		if(isset($_GET['windSpeedMax'])){
			if($_GET['windSpeedMax'] != ""){
				$sql .= " CAST((COALESCE(mps,'0')) AS double precision) <= " . $_GET['windSpeedMax'] . " AND ";
			}
		}
		if(isset($_GET['windDirMin'])){
			if($_GET['windDirMin'] != ""){
				$sql .= " direction >= " . $_GET['windDirMin'] . " AND ";
			}
		}
		if(isset($_GET['windDirMax'])){
			if($_GET['windDirMax'] != ""){
				$sql .= " direction <= " . $_GET['windDirMax'] . " AND ";
			}
		}
	}
}
// 
// //the SQL is fully build with all the parameters now
// //clear the ending
$whereCheck = substr($sql, -7);
if ($whereCheck == " WHERE "){
	$sql = substr($sql, 0, -7);
}
$andCheck = substr($sql, -5);
if($andCheck == " AND "){
	$sql = substr($sql, 0, -5);
}

$sql .= ";";


// //do the sql
$result = pg_query($sql);
// 

//make the result
if($result){
	$success = true;
}else{
	$success = false;
}


$out = array(
	'timestamp'=> date('l jS \of F Y h:i:s A'),
	'success'=>$success
);

$out['query'] = $sql;
$allData = array(); 

// 
while ($data = pg_fetch_array($result)) {
	$itemData = array();
	$i = 0;
	while ($i < count($colnames)){
		$thisCol = $colnames[$i];
		$thisVal = $data[$i];
		$itemData[$thisCol] = $thisVal;
		try {
			$itemData[$thisCol] = $thisVal;
		} catch (Exception $e) {
		    echo $e;
		}
		 $i = $i + 1;
	}
	array_push($allData, $itemData);
}
$out['data'] = $allData;
$out = json_encode($out);
if(isset($_GET['callback'])){
	if($_GET['callback'] != ""){
		$out = $_GET['callback'] . "(" . out . ")";
	}
}
echo $out;
?>