import React from "react";
import { Text, View, Button } from "react-native";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { DialogComponent, SlideAnimation } from "react-native-dialog-component";
import { getProfileAction, loginAction } from "../store/actions/profile";
import { profileSelector } from "../store/selectors/profile";
import { styles } from "../styles";
import { startLogin } from "../helpers";
import Dialog from "./dialog";

class Home extends React.Component {
  static navigationOptions = {
    title: "Home"
  };

  state = {
    dialogState: "before"
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

  render() {
    const { profile } = this.props;
    const { navigate } = this.props.navigation;
    const { dialogState } = this.state;
    return (
      <View style={styles.container}>
        <Text>HeartBeatz</Text>
        <Text>Pace your run with your favorite music</Text>
        {profile && profile.loggedIn ? (
          <Text>
            You're connected to Spotify! Go ahead and start making playlists.
          </Text>
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
        <Button title="Create a Playlist" onPress={() => navigate("Create")} />
        <DialogComponent
          ref={dialogComponent => {
            this.dialogComponent = dialogComponent;
          }}
          dialogAnimation={new SlideAnimation({ slideFrom: "bottom" })}
          width={300}
          height={200}
          dialogStyle={styles.modal}
          onDismissed={() => {
            this.setState({ dialogState: "before" });
          }}
        >
          <Dialog dialogState={dialogState} />
        </DialogComponent>
      </View>
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
)(Home);
