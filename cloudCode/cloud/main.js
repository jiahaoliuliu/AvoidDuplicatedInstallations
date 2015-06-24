
// Code Used to avoid duplication in installation. The uniqueId is
// a custom column in the installation table which contains all
// the Universal Unique ID of each device.
Parse.Cloud.beforeSave(Parse.Installation, function(request, response) {
    // If it is an update, then don't do anything
    if (!request.object.isNew()) {
        console.log("It is not going to create a new entry. Not doing anything");
        response.success();
        return;
    }

    Parse.Cloud.useMasterKey();
    var query = new Parse.Query(Parse.Installation);
    console.log("The unique id to check is " + request.object.get("uniqueId"));
    query.equalTo("uniqueId", request.object.get("uniqueId"));
    //query.ascending("updatedAt");
    // Prevents removing of current ParseInstallation
    // if (request.object.existed()) {
    //     console.log("The current object exists which is " + request.object.id);
    //     query.notEqualTo("objectId", request.object.id); 
    // } else {
    //     console.log("The current object does not exists " + request.object.id);
    // }
    query.first().then(function(duplicate) {
        console.log("Duplicate is " + duplicate);
        if (typeof duplicate === "undefined") {
            console.log("No duplicated installations, New installation");
            response.success();
        } else {
            console.log("Duplicated installation is detected. The id is " + duplicate.id
                + " and the last modification time is " + duplicate.updatedAt);
            // duplicate.destroy().then(function(duplicate){
            //     console.log("Successfully deleted duplicate");
            //     response.error();
            // }, function() {
            //     console.log(error.code + " " + error.message);
            //     response.error();
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