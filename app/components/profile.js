import React from "react";
import { createStructuredSelector } from "reselect";
import { Text, View, Button } from "react-native";
import { DialogComponent, SlideAnimation } from "react-native-dialog-component";
import { connect } from "react-redux";
import {
  getProfileAction,
  loginAction,
  logoutAction
} from "../store/actions/profile";
import { profileSelector } from "../store/selectors/profile";
import { styles } from "../styles";
import { startLogin } from "../helpers";
import Dialog from "./dialog";

class Profile extends React.Component {
  static navigationOptions = {
    title: "Profile"
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

  startLogout = () => {
    const { logout } = this.props;
    logout();
    this.setState({ dialogState: "logout" }, () => {
      console.log(this.state.dialogState);
      this.dialogComponent.show();
    });
  };

  render() {
    const { navigate } = this.props.navigation;
    const { profile } = this.props;
    const { dialogState, mounted } = this.state;
    return (
      <View style={styles.container}>
        {profile && profile.loggedIn ? (
          <View>
            <Text>Welcome, {profile.name}</Text>
            <Button
              title="Disconnect from Spotify"
              onPress={this.startLogout}
            />
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
  getProfile: getProfileAction,
  login: loginAction,
  logout: logoutAction
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
