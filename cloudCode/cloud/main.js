
// Code Used to avoid duplication in installation. The uniqueId is
// a custom column in the installation table which contains all
// the Universal Unique ID of each device.
Parse.Cloud.beforeSave(Parse.Installation, function(request, response) {
    Parse.Cloud.useMasterKey();
    var query = new Parse.Query(Parse.Installation);
    query.equalTo("uniqueId", request.object.get("uniqueId"));
    if (request.object.existed()) { // this prevents removing of current ParseInstallation
        query.notEqualTo("objectId", request.object.id); 
    }
    query.first().then(function(duplicate) {
        if (typeof duplicate === "undefined") {
            console.log("No duplicated installations, New installation");
            response.success();
        } else {
            console.log("Duplicated installation is detected... Trying to delete " + duplicate.id);
            console.log("Duplicated last modification time " + duplicate.updatedAt);            
            // duplicate.destroy().then(function(duplicate){
            //     console.log("Successfully deleted duplicate");
            //     response.success();
            // }, function() {
            //     console.log(error.code + " " + error.message);
            //     response.success();
            // });
//            response.success();
            // Prevent the actual object being saved if a duplication already exists
            response.error();
        }
    }, function(error) {
       console.warn(error.code + error.message);
       response.error();
    });
});