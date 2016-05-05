<?php
set_time_limit (0); //don't timeout on big queries
//show errors 
ini_set('display_errors',1);
error_reporting(E_ALL);
ini_set('memory_limit', '-1');

//connect to the database
$db_connection = pg_connect("host=localhost dbname=wooden_ships user=scottsfarley password=xP73m3YAb1"); // geography grad server
//user scottsfarley has all permissions on this database
if (!$db_connection){
	die("Could not connect to database: ".pg_errormessage($db_connection));
}else{
}

            // weatherID serial PRIMARY KEY,
            // locationID integer references locations (locationID),
            // airtemp double precision,
            // pressure double precision,
            // sst double precision,
            // winddirection double precision,
            // windforce double precision,
            // pumpwater double precision,
            // gusts boolean,
            // rain boolean,
            // fog boolean,
            // snow boolean,
            // thunder boolean,
            // hail boolean,
            // seaice boolean


$sql = "SELECT voyages.voyageid, locations.locationid, captains.captainName, nations.nationality, companies.companyName, ships.shipname, ships.shipType, voyages.fromPlace, voyages.toPlace,";
$sql .= " voyages.startdate, locations.locationid, locations.longitude, locations.date, weather.airtemp, weather.pressure, weather.sst, weather.winddirection,";
$sql .= " weather.windforce, weather.gusts, weather.fog, weather.rain, weather.snow, weather.thunder, weather.hail, weather.seaice from ";
$sql .= " weather ";
$sql .= " INNER JOIN locations on locations.locationid=weather.locationid ";
$sql .= " INNER JOIN voyages on voyages.voyageid = locations.voyageid ";
$sql .= " INNER JOIN captains on captains.captainid = voyages.captainid ";
$sql .= " INNER JOIN nations on nations.nationid = voyages.nationid ";
$sql .= " INNER JOIN ships on ships.shipid = voyages.shipid ";
$sql .= " INNER JOIN companies on companies.companyid = voyages.companyid ";
//$sql .= " group by voyages.voyageid, captains.captainid ";
$sql .= " WHERE ";

	 
$voyageColnames = array("voyageID", "captainName", "nationality", "companyName", "shipName", "shipType", "voyageFromPlace", "voyageToPlace", "voyageStartDate");
$pointColnames = array("locationID", "latitude", "longitude", "date");
$weatherColnames = array("airTemp", "airPressure", "seaSurfaceTemp", "windDirection", "windSpeed", "gusts", "fog", "rain", "snow", "thunder", "hail", "seaice");
$obsColnames = array("observationID", "memoType", "memoText", "memoLanguage");	
$colnames = array("voyageID", "locationID", "captainName", "nationality", "companyName", "shipName", "shipType", 'fromPlace', "toPlace", "startDate", "longitude", "latitude",
	"date", "airTemp", "airPressure", "sst", "windDirection", "windSpeed", "gusts", "fog", "rain", "snow", "thunder", "hail", "seaIce");

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
if (isset($_GET['captainName'])){
	if($_GET['captainName'] != ""){$sql .= " captainName='" . $_GET['captainName'] . "' AND ";}
}

//airTemp
if(isset($_GET['minAirTemp'])){
	if($_GET['minAirTemp'] != ""){
		$sql .= " airTemp > " . $_GET['minAirTemp'] . " AND ";
	}
}
if(isset($_GET['maxAirTemp'])){
	if($_GET['maxAirTemp'] != ""){
		$sql .= " airTemp < " . $_GET['maxAirTemp'] . " AND ";
	}
}
//pressure
if(isset($_GET['minPressure'])){
	if($_GET['minPressure'] != ""){
		$sql .= " pressure > " . $_GET['minPressure'] . " AND ";
	}
}
if(isset($_GET['maxPressure'])){
	if($_GET['maxPressure'] != ""){
		$sql .= " pressure < " . $_GET['maxPressure'] . " AND ";
	}
}

//was it gusty?
if(isset($_GET['gusts'])){
	if ( ($_GET['gusts'] == "true")){
		$sql .= " gusts = TRUE AND ";
	}
}

//rainy?
if(isset($_GET['rain'])){
	if ( ($_GET['rain'] == "true")){
		$sql .= " rain = TRUE AND ";
	}
}
//foggy?
if(isset($_GET['fog'])){
	if ($_GET['fog'] == "true"){
		$sql .= " fog = TRUE AND ";
	}
}
//snowy?
if(isset($_GET['snow'])){
	if ( ($_GET['snow'] == "true")){
		$sql .= " snow = TRUE AND ";
	}
}

//thundery?
if(isset($_GET['thunder']) ){
	if ( ($_GET['thunder'] == "true")){
		$sql .= " thunder = TRUE AND ";
	}
}

//hailing?
if(isset($_GET['hail']) ){
	if (($_GET['hail'] == "true")){
		$sql .= ' hail = TRUE AND ';
	}
}
//sea ice noted?
if(isset($_GET['seaice']) ){
	if ( ($_GET['seaice'] == "true")){
		$sql .= ' seaice = TRUE AND ';
	}
}
// //temporal search --> better than specifying year and month and day
if(isset($_GET['maxDate'])){
	if($_GET['maxDate'] != ""){
		$sql .= " locations.date <= CAST('" . $_GET['maxDate'] . "' AS DATE) AND ";
	}
}
if(isset($_GET['minDate'])){
	if($_GET['minDate'] != ""){
		$sql .= " locations.date >= CAST('" . $_GET['minDate'] . "' AS DATE) AND ";
	}
}
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

if (isset($_GET['locationID'])){
	if ($_GET['locationID'] != ""){
	$sql .= " locations.locationid=" . $_GET['locationID'] ." ";		
	}
}
// // 
// // 
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

$sql .= " order by voyageid, date ; ";


// //do the sql
$result = pg_query($sql);
// 

//make the result
if($result){
	$success = true;
}else{
	$success = false;
}

$voyageIDs = array();
$locationIDs = array();

$out = array(
	'timestamp'=> date('l jS \of F Y h:i:s A'),
	'success'=>$success
);

$out['query'] = $sql;
$allData = array(); 


// // 
while ($data = pg_fetch_array($result)) {
	$itemData = array();
	$i = 0;
	while ($i < count($colnames)){
		$thisCol = $colnames[$i];
		$thisVal = $data[$i];
		$itemData[$thisCol] = $thisVal;
		 $i = $i + 1;
	}
	$locationID = $data[1];
	if (isset($_GET['returnObservations'])){
		$itemData['Observations'] = array();
		if($_GET['returnObservations'] != ""){
			$subsql = "SELECT obsid, memotype, memotext, memolanguage FROM observations WHERE locationid=" . $locationID . ";";
			$subresult = pg_query($subsql);
			while($obsData = pg_fetch_array($subresult)){
				$row = array();
				$p = 0;
				while ($p < count($obsColnames)){
					$col = $obsColnames[$p];
					$val = $obsData[$p];
					$row[$col] = $val;
					$p = $p + 1;
				}
				array_push($itemData['Observations'], $row);
			}	
		}
	}

	array_push($allData, $itemData);
}
$out['data'] = $allData;
$out = json_encode($out);
if(isset($_GET['callback'])){
	if($_GET['callback'] != ""){
		$out = $_GET['callback'] . "(" . $out . ")";
	}
}
echo $out;
?>