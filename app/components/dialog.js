import React from "react";
import { Text, View, Button } from "react-native";

class Dialog extends React.PureComponent {
  render() {
    const { dialogState, playlistName, bpm, url } = this.props;
    return (
      <View>
        {dialogState === "before" && (
          <View>
            <Text>You will now be redirected to Spotify</Text>
            <Text>This might take a few seconds</Text>
          </View>
        )}
        {dialogState === "success" && (
          <View>
            <Text>Success!</Text>
            <Text>You have successfully connected to Spotify</Text>
          </View>
        )}
        {dialogState === "cancelled" && (
          <View>
            <Text>Cancelled!</Text>
            <Text>Tap anywhere outside the box to close</Text>
          </View>
        )}
        {dialogState === "failed" && (
          <View>
            <Text>Your login failed for some reason.</Text>
            <Text>Feel free to try again</Text>
          </View>
        )}
        {dialogState === "logout" && (
          <View>
            <Text>You have logged out successfully</Text>
          </View>
        )}
        {dialogState === "creating" && (
          <View>
            <Text>Creating your playlist now</Text>
            <Text>This may take a few seconds</Text>
          </View>
        )}
        {dialogState === "created" && (
          <View>
            <Text>Your playlist was successfully created!</Text>
            <Text>Name: {playlistName} </Text>
            <Text>BPM: {bpm} </Text>
            <View>
              <Button title={"Open In Spotify"} onPress={() => openLink(url)} />
            </View>
          </View>
        )}
        {dialogState === "invalid" && (
          <View>
            <Text>
              You must input a name, bpm and check one of the options.
            </Text>
          </View>
        )}
      </View>
    );
  }
}

export default Dialog;
