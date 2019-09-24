import { Linking } from "expo";

export const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const startLogin = componentThis => {
  const { login } = componentThis.props;
  componentThis.dialogComponent.show();
  login().then(response => {
    if (response === "cancelled") {
      componentThis.setState({ dialogState: "cancelled" }, () => {
        componentThis.dialogComponent.show();
      });
      componentThis.dialogComponent.show();
    } else if (response === "failed") {
      componentThis.setState({ dialogState: "failed" }, () => {
        componentThis.dialogComponent.show();
      });
    } else {
      componentThis.dialogComponent.dismiss();
    }
  });
};

export const openLink = url => {
  Linking.openURL(url);
};
