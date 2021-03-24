import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import NavBar from '../NavBar/NavBar';
import Program from '../ProgramInfo/Program';
import FindResource from '../FindResources/FindResources';
import Signup from "../Auth/Signup";
import Login from "../Auth/Login";
import SignIn from "../../SignIn";
import UpdateProfile from "../Auth/UpdateProfile";
import PrivateRoute from "../Auth/PrivateRoute";
import Message from "../Auth/Message";
import Inbox from "../Inbox/Inbox";
import InboxCard from "../Inbox/InboxCard";

const StartPage = () => {
  //const { currentUser, logout } = useAuth();

    return(
      <>
            <NavBar />
            <Message />
            <Switch>
                <Route 
                  exact 
                  path="/" 
                  render={(props) => <FindResource {...props} />} 
                />
                <Route 
                  exact
                  path="/programs/:program_ID"
                  render={(props) => <Program {...props} />}
                />
                 <Route 
                  exact
                  path="/messages/:message_ID"
                  render={(props) => <InboxCard {...props} />}
                />
                <Route path="/signup" component={Signup} />
                <Route path="/login" component={Login} />
                <Route path="/signin" component={SignIn} />
                <PrivateRoute path="/profile" component={UpdateProfile} />
                <PrivateRoute path="/inbox" component={Inbox} />
            </Switch>

      </>
    )
}

export default StartPage;