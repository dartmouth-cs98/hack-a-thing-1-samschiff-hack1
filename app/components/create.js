import React from "react";
import { Text, View, Button, TextInput } from "react-native";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { DialogComponent, SlideAnimation } from "react-native-dialog-component";
import { getProfileAction, loginAction } from "../store/actions/profile";
import { profileSelector } from "../store/selectors/profile";
import { createPlaylist } from "../services/playlist";
import { CheckBox } from "react-native-elements";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import { styles } from "../styles";
import { startLogin } from "../helpers";
import Dialog from "./dialog";

class Create extends React.Component {
  static navigationOptions = {
    title: "Create"
  };
  state = {
    useSavedSongs: true,
    usePlaylists: false,
    playlistName: "",
    bpm: null,
    dialogState: "before",
    height: 200
  };

  componentDidMount() {
    this.fetchIfNecessary();
  }

  componentDidUpdate() {
    this.fetchIfNecessary();
  }

  fetchIfNecessary = () => {
    const { profile, getProfile } = this.props;
    if (profile && profile.loggedIn && !profile.name) {
      getProfile();
    }
  };

  makePlaylist = () => {
    const { profile } = this.props;
    if (!profile || !profile.loggedIn) {
      startLogin(this);
    } else {
      const { useSavedSongs, usePlaylists, bpm, playlistName } = this.state;
      if ((useSavedSongs || usePlaylists) && bpm && playlistName) {
        this.setState({ dialogState: "creating" }, () => {
          this.dialogComponent.show();
        });
        createPlaylist(useSavedSongs, usePlaylists, bpm, playlistName)
          .then(response => response.json())
          .then(res => {
            this.setState(
              { dialogState: "created", height: 400, url: res.url },
              () => {
                this.dialogComponent.show();
              }
            );
          });
      } else {
        this.setState({ dialogState: "invalid" }, () => {
          this.dialogComponent.show();
        });
      }
    }
  };

  toggleUseSavedSongs = () => {
    this.setState({
      useSavedSongs: !this.state.useSavedSongs
    });
  };

  toggleUsePlaylists = () => {
    this.setState({
      usePlaylists: !this.state.usePlaylists
    });
  };

  render() {
    const { dialogState, height, url, playlistName, bpm } = this.state;
    const { profile } = this.props;
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          {profile && profile.loggedIn ? (
            <View>
              <Text>Welcome, {profile.name}</Text>
              <Text>
                You've successfully connected. Go ahead and make a playlist
                below.
              </Text>
            </View>
          ) : (
            <View>
              <Button
                title="Connect To Spotify"
                onPress={() => {
                  startLogin(this);
                }}
              />
            </View>
          )}
          <Text>Playlist Name</Text>
          <TextInput
            style={{
              height: 40,
              borderColor: "gray",
              borderWidth: 1,
              width: 200
            }}
            placeholder="Your playlist name here"
            onChangeText={text => this.setState({ playlistName: text })}
            value={playlistName}
          />
          <Text>Beats per minute</Text>
          <TextInput
            style={{
              height: 40,
              borderColor: "gray",
              borderWidth: 1,
              width: 50
            }}
            placeholder="BPM"
            keyboardType={"numeric"}
            onChangeText={number => this.setState({ bpm: number })}
            value={bpm}
          />
          <CheckBox
            title="Use Your Saved Songs"
            checked={this.state.useSavedSongs}
            onPress={this.toggleUseSavedSongs}
          />
          <CheckBox
            title="Use Songs from your Saved Playlists"
            checked={this.state.usePlaylists}
            onPress={this.toggleUsePlaylists}
          />
          <Button title="Create Playlist" onPress={this.makePlaylist} />
          <DialogComponent
            ref={dialogComponent => {
              this.dialogComponent = dialogComponent;
            }}
            dialogAnimation={new SlideAnimation({ slideFrom: "bottom" })}
            width={300}
            height={height}
            dialogStyle={styles.modal}
            onDismissed={() => {
              this.setState({ dialogState: "before" });
            }}
          >
            <Dialog
              dialogState={dialogState}
              playlistName={playlistName}
              bpm={bpm}
              url={url}
            />
          </DialogComponent>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  profile: profileSelector
});

const mapDispatchToProps = {
  login: loginAction,
  getProfile: getProfileAction
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Create);
