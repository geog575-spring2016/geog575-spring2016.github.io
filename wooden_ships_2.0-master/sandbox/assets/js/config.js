/**
 * @author Scott Farley
 */
/* This file is for application configuration that can be easily changed and reused in multiple places.
 * This is not the same as the globals object.
 * Use this location for things such as color definitions, database, server, etc configurations.
 */
config = {} //this is the main object for application configuration, from which we can have child objects
colors  ={} //this is if we want to define our colors in javascript and change them all around the application in a single line

config.database = {} //this contains database access parameters
config.database.URL = "localhost:8080" // this is the location of the database server (which might not be the same as the applciation server)
config.database.port = "8080"

config.server = {}
config.server.port = "8000"
