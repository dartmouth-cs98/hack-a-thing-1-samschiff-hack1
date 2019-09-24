import { createBottomTabNavigator, createAppContainer } from "react-navigation";
import Home from "./components/home";
import Profile from "./components/profile";
import Create from "./components/create";
import rootReducer from "./store/reducers";
import React from "react";
import thunk from "redux-thunk";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

const MainNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        tabBarIcon: ({ focused }) => <Ionicons name={`md-home`} size={20} />
      }
    },
    Create: {
      screen: Create,
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <Ionicons name={`md-musical-notes`} size={20} />
        )
      }
    },
    Profile: {
      screen: Profile,
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <Ionicons name={`md-information-circle`} size={20} />
        )
      }
    }
  },
  {
    tabBarOptions: {}
  }
);

const store = createStore(rootReducer, applyMiddleware(thunk));

const Navigation = createAppContainer(MainNavigator);

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Navigation />
      </Provider>
    );
  }
}
