import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Register from './pages/tasks/Register';
import Task1 from './pages/tasks/Task1';
import Task2 from './pages/tasks/Task2';
import Task3 from './pages/tasks/Task3';
import Results from './pages/tasks/Results';
import Summary from './pages/tasks/Summary';
import SummaryRaw from './pages/tasks/SummaryRaw';
import SummaryNBack from './pages/tasks/SummaryNBack';
import SummaryNBackRaw from './pages/tasks/SummaryNBackRaw';
import SummaryShape from './pages/tasks/SummaryShape';
import SummaryShapeRaw from './pages/tasks/SummaryShapeRaw';

import Users from './admin/pages/Users';
import NewUserItem from './admin/components/NewUserItem';

import Auth from './admin/pages/Auth';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';

import { StoreContext } from './shared/context/store-context';
import { useStore } from './shared/hooks/store-hook';
import { useHttpClient } from './shared/hooks/http-hook';

const App = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const { token, login, logout, userId, schoolType } = useAuth();

  let routes;

  const {
    isAdmin,
    users,
    testRegisters,
    behaviortests,
    behaviors1,
    UpdateBehaviors1,
    UpdateBehaviortests,
    UpdateUsers,
    UpdateEverything,
    UpdateRegister,
  } = useStore();

  useEffect(() => {
    const UpdateStore = async () => {
      if (userId != false && token) {
        try {
          const responseData = await sendRequest(
            `${process.env.REACT_APP_BACKEND_URL}/users/${userId}`
          );
          const currentuser = responseData.user;
            await UpdateEverything('All');
        } catch (err) {
          console.log('HATA:   ' + err);
        }
      }
    };

    UpdateStore();
  }, [userId]);

  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Register />
        </Route>
        <Route path="/register" exact>
          <Register />
        </Route>

        <Route path="/task1" exact>
          <Task1 />
        </Route>

        <Route path="/task2" exact>
          <Task2 />
        </Route>

        <Route path="/task3" exact>
          <Task3 />
        </Route>

        <Route path="/results" exact>
          <Results />
        </Route>

        <Route path="/summary" exact>
          <Summary />
        </Route>

        <Route path="/summary-raw" exact>
          <SummaryRaw />
        </Route>

        <Route path="/summary-nback" exact>
          <SummaryNBack />
        </Route>

        <Route path="/summary-nback-raw" exact>
          <SummaryNBackRaw />
        </Route>

        <Route path="/summary-shape" exact>
          <SummaryShape />
        </Route>

        <Route path="/summary-shape-raw" exact>
          <SummaryShapeRaw />
        </Route>

      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Auth />
        </Route>
        <Route path="/auth" exact>
          <Auth />
        </Route>
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        schoolType: schoolType,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation />
        <StoreContext.Provider
          value={{
            isAdmin: isAdmin,
            users: users,
            testRegisters: testRegisters,
            behaviortests: behaviortests,
            behaviors1: behaviors1,
            UpdateBehaviors1: UpdateBehaviors1,
            UpdateBehaviortests: UpdateBehaviortests,
            UpdateUsers: UpdateUsers,
            UpdateEverything: UpdateEverything,
            UpdateRegister: UpdateRegister,
          }}
        >
          <main>{routes}</main>
        </StoreContext.Provider>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
