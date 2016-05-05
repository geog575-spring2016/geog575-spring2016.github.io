#Database and API
####Updated March 19, 2016

##Basic
The API and underlying database is a way that we can access the data with dynamic queries from our javascript programs. Please follow these instructions to get data through ajax calls to the server.  

## Setting up the database
The database has been set up on the [geography grad server](http://grad.geography.wisc.edu/sfarley2) and now resides there. Please let me know if you have any questions about this.

####Using the API
You can query the database using a web browser using the method outlined below.  Basically, you type in a resource name (like 'Captains.php') and then a '?' and then a list of parameters and values (param1=value1) separated by '&'. There are good google resources that can explain rest apis if you're not familiar. The api string will start with ```http://grad.geography.wisc.edu/sfarley2/``` followed by a resource name, followed by a set of parameter value pairs.  Example: ```http://grad.geography.wisc.edu/sfarley2/Ships.php?nationality=British&minDate=1800-01-01&maxDate=1810-01-01``` would return all of the British ships active between 1800 and 1810.

Please refer to [http://grad.geography.wisc.edu/sfarley2/index.php](http://grad.geography.wisc.edu/sfarley2/index.html) for documentation of the API.  Specify only the parameters listed, and expect to recevie only the fields listed. I will update the documentation as I update the API.  

Cheers for now.
