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
$sql .= " INNER JOIN observations on observations.locationid = locations.locationid ";
$sql .= " WHERE ";

$obsColnames = array("observationID", "memoType", "memoText", "memoLanguage");		
$colnames = array("voyageID", "locationID", "captainName", "nationality", "companyName", "shipName", "shipType", 'fromPlace', "toPlace", "startDate", "longitude", "latitude",
	"date", "airTemp", "airPressure", "sst", "windDirection", "windSpeed", "gusts", "fog", "rain", "snow", "thunder", "hail", "seaIce");

//what was the ships name?
if (isset($_GET['locationID'])){
	if ($_GET['locationID'] != ""){
	$sql .= " locations.locationid=" . $_GET['locationID'] ." ";		
	}
}
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

$sql .= " order by voyageid, date LIMIT 1; ";


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


// // 
while ($data = pg_fetch_array($result)) {
	$itemData = array();
	$itemData['Observations'] = array();
	$i = 0;
	while ($i < count($colnames)){
		$thisCol = $colnames[$i];
		$thisVal = $data[$i];
		$itemData[$thisCol] = $thisVal;
		 $i = $i + 1;
	}
	$locationID = $data[1];
	$subsql = "SELECT obsid, memotype, memotext, memolanguage FROM observations WHERE locationid=" . $_GET['locationID'] . ";";
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