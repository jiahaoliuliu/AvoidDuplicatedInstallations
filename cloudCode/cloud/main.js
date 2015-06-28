
// Code Used to avoid duplication in installation. The uniqueId is
// a custom column in the installation table which contains all
// the Universal Unique ID of each device.
Parse.Cloud.beforeSave(Parse.Installation, function(request, response) {
    var uniqueIdKey = "uniqueId";
    var channelId = "channels"

    if (!request.object.has(uniqueIdKey)) {
        console.log("The object does not have the unique Id");
        response.success();
        return;
    }

    console.log("The object contains the uniqueId " + request.object.get(uniqueIdKey));

    // If it is an update, then don't do anything
    Parse.Cloud.useMasterKey();
    var query = new Parse.Query(Parse.Installation);
    console.log("The unique id to check is " + request.object.get("uniqueId"));
    query.equalTo("uniqueId", request.object.get("uniqueId"));
    query.descending("updatedAt");
    query.find().then(function(duplicates) {
        console.log("The length of the duplicated installations is " + duplicates.length);
        if (duplicates.length == 0) {
            console.log("No duplicated installations, New installation");
            response.success();
        } else if (duplicates.length == 1) {
            console.log("The length of the duplicated installations is 1");
            var possibleDuplication = duplicates[0];
            // Because parse has some problem to distinguishi the existing row and the
            // row that is going to be added, check if the row gotten is the actual one
            if (possibleDuplication.id == request.object.id) {
                console.log("The id of the duplicated element is the same as the actual element,everything is ok");
                response.success();
            } else {
                console.log("The existence object is not the actual element. remove the actual element");
                var originalChannels=possibleDuplication.get(channelId);
                var channelsLength = originalChannels.length;
                for (var i = 0; i < channelsLength; i++) {
                    console.log("Adding the channel " + originalChannels[i]);
                    request.object.addUnique(channelId, originalChannels[i]);
                }

                possibleDuplication.destroy().then(
                    function(duplicate){
                        console.log("Successfully deleted duplicate");
                        response.success();
                    }, function() {
                        console.log(error.code + " " + error.message);
                        response.success();
                    }
                );
            }
        } else {
            console.log("The length of the duplicated installations is not 1");
            var positionToBeKept = 0;          
            for (var i = 0; i < duplicates.length; i++) {
                console.log("The duplicated has id " + duplicates[i].id);
                // If it is the position to be kept
                if (i == positionToBeKept) {
                    console.log("Position is the position of the element to be kept. Checking if it is the element to be saved.");
                    if (duplicates[i].id == request.object.id) {
                        positionToBeKept++;
                        console.log("The duplicated object is the actual element to be saved. Removing the actual element");
                        request.object.destroy().then(
                            function(duplicate){
                                console.log("Successfully deleted duplicate");
                                response.success();
                            }, function() {
                                console.log(error.code + " " + error.message);
                                response.success();
                            }
                        );
                    }
                // If it is not the position to be kept, remove it
                } else {
                    console.log("It is not the element to be kept. Removing it");
                    duplicates[i].destroy().then(
                        function(duplicate){
                            console.log("Successfully deleted duplicate of the position " + i);
                        }, function() {
                            console.log(error.code + " " + error.message);
                        }
                    );
                }
            }
            response.success();
        }
    }, function(error) {
       console.warn(error.code + error.message);
       response.success();
    });
});