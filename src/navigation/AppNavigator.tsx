import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { observer } from "mobx-react-lite";
import { rootStore } from "../store";
import AuthStack from "./AuthStack";
import MainStack from "./MainStack";

const AppNavigator = observer(() => {
  useEffect(() => {
    rootStore.initialize();
  }, []);

  return (
    <NavigationContainer>
      {rootStore.auth.isAuthenticated ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
});

export default AppNavigator;
