
// Code Used to avoid duplication in installation. The uniqueId is
// a custom column in the installation table which contains all
// the Universal Unique ID of each device.
Parse.Cloud.beforeSave(Parse.Installation, function(request, response) {
    var uniqueIdKey = "uniqueId";
    var channelIdKey = "channels";
    var installationIdKey = "installationId";

    var dirtyKeys = request.object.dirtyKeys();
    for (var i =0; i < dirtyKeys.length; i++) {
        console.log("Field to be updated " + dirtyKeys[i]);
        if (dirtyKeys[i] !== uniqueIdKey) {
            console.log("Not updating unique id");
            response.success();
            return;
        }
    }

    console.log("The object contains the uniqueId " + request.object.get(uniqueIdKey));
    // If it is an update, then don't do anything
    Parse.Cloud.useMasterKey();
    var query = new Parse.Query(Parse.Installation);
    console.log("The unique id to check is " + request.object.get("uniqueId"));
    query.equalTo("uniqueId", request.object.get("uniqueId"));
    console.log("The actual object id is " + request.object.id);
        if (request.object.has(installationIdKey)) {        
        // The request object could not have installation id
        console.log("The actual installation id is " + request.object.get("installationId"));
        query.notEqualTo(installationIdKey, request.object.get(installationIdKey));
    }
    query.notEqualTo("objectId", request.object.id);
    query.descending("updatedAt");
    query.find().then(function(duplicates) {
        console.log("The length of the duplicated installations is " + duplicates.length);
        if (duplicates.length == 0) {
            console.log("No duplicated installations, New installation");
            response.success();
        } else {
            var duplicatedLength = duplicates.length;
            for (var j = 0; j < duplicatedLength; j++) {
                console.log("Duplicated intallation found with id " + duplicates[j].id);
                var duplicatedItem = duplicates[j];
                var originalChannels=duplicatedItem.get(channelIdKey);
                var channelsLength = originalChannels.length;
                for (var k = 0; k < channelsLength; k++) {
                    console.log("Adding the channel " + originalChannels[k]);
                    request.object.addUnique(channelIdKey, originalChannels[k]);
                }

                console.log("Removing the duplicated item");
                duplicatedItem.destroy().then(
                    function(duplicate){
                        console.log("Successfully deleted duplicate");
                    }, function(error) {
                        console.log(error.code + " " + error.message);
                    }
                );
            }
            console.log("Sending success message");
            response.success();
        }
    }, function(error) {
       console.warn(error.code + error.message);
       // If there is any problem, keep the actual installation
       response.success();
    });
});