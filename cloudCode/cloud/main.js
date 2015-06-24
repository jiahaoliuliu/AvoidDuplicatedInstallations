
// Code Used to avoid duplication in installation. The uniqueId is
// a custom column in the installation table which contains all
// the Universal Unique ID of each device.
Parse.Cloud.beforeSave(Parse.Installation, function(request, response) {
    var uniqueIdKey = "uniqueId";

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
    query.ascending("updatedAt");
    query.find().then(function(duplicates) {
        console.log("The length of the duplicated installations is " + duplicates.length);
        if (duplicates.length == 0) {
            console.log("No duplicated installations, New installation");
            response.success();
        } else if (duplicates.length == 1) {
            console.log("The length of the duplicated installations is 1");
            // Because parse has some problem to distinguishi the existing row and the
            // row that is going to be added, check if the row gotten is the actual one
            if (duplicates[0].id == request.object.id) {
                console.log("The id of the duplicated element is the same as the actual element,everything is ok");
                response.success();
            } else {
                console.log("The existence object is not the actual element. remove the actual element");
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
        } else {
            console.log("The lenght of the duplicated installations is not 1");            
            for (var i = 0; i < duplicates.length; i++) {
                console.log("The duplicated has id " + duplicates[i].id);
            }
            response.success();
        }
        // // If there is only one element, then finish
        // if (duplicates.length == 1) {
        //     console.log("There is only one element in the list");
        //     var uniqueElement = duplicates[0];
        //     console.log("The id of the element is " + uniqueElement.id);
        //     if (uniqueElement.id == request.object.id) {
        //         console.log("it is the same element as the request element. Finish");
        //         request.object.set(checkedKey, true);
        //         response.success();
        //     }

        // } else {
        // if (typeof duplicate === "undefined") {
        //     console.log("No duplicated installations, New installation");
        //     response.success();
        // } else {
        //     console.log("Duplicated installation is detected. The id is " + duplicate.id
        //         + " and the last modification time is " + duplicate.updatedAt);
        // duplicate.destroy().then(function(duplicate){
        //     console.log("Successfully deleted duplicate");
        //     response.error();
        // }, function() {
        //     console.log(error.code + " " + error.message);
        //     response.error();
        // });
//            response.success();
        // Prevent the actual object being saved if a duplication already exists
        // }
    }, function(error) {
       console.warn(error.code + error.message);
       response.success();
    });
});