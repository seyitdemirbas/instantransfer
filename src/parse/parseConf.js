import Parse from "parse";

Parse.serverURL = process.env.REACT_APP_PARSE_CONFIG_SERVER_URL
Parse.initialize(process.env.REACT_APP_PARSE_CONFIG_APP_ID,process.env.REACT_APP_PARSE_CONFIG_JAVASCRIPT_KEY)
Parse.enableLocalDatastore();