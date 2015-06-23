package com.jiahaoliuliu.avoidduplicatedinstallations;

import android.app.Application;
import android.util.Log;

import com.parse.Parse;
import com.parse.ParseException;
import com.parse.ParsePush;
import com.parse.SaveCallback;

/**
 * Created by Jiahao on 6/23/15.
 */
public class MainApplication extends Application {
    private static final String TAG = "MainApplication";

    @Override
    public void onCreate() {
        super.onCreate();

        // Initialize Parse
        Parse.initialize(this, APIKeys.APPLICATION_ID, APIKeys.CLIENT_ID);
        ParsePush.subscribeInBackground("", new SaveCallback() {
            @Override
            public void done(ParseException e) {
                if (e == null) {
                    Log.d(TAG, "successfully subscribed to the broadcast channel.");
                } else {
                    Log.e(TAG, "failed to subscribe for push", e);
                }
            }
        });
    }
}
