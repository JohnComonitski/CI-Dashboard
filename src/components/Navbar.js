
import React, { useState, useContext} from "react";
import { Nav, Image, Navbar, Dropdown, Container } from '@themesberg/react-bootstrap';
import { Routes } from "../routes";

import { UserContext } from "../pages/UserContext";

export default (props) => {
  const [history] = useState(props.history);
  //User
  const {user} = useContext(UserContext);

  //sign out
  const signOut = () => {
    const auth2 = window.gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
      console.log('User signed out.');
    });
    props.history.push({pathname: Routes.Signin.path});
  }

  const AdminNav = () =>{
    const NavItem = (props)=>{
      return (
        <Dropdown.Item id={props.id} onClick={(e) => {history.push({pathname: Routes.DashboardOverview.path, state: props.id});}} className="fw-bold">
           {props.name}
        </Dropdown.Item>
      );
    }
    if(!user.admin){
      return(
        <Dropdown.Menu className="user-dropdown dropdown-menu-right mt-2">
          <Dropdown.Item id={props.id} onClick={signOut} className="fw-bold">
             Sign Out
          </Dropdown.Item>
        </Dropdown.Menu>
      );
    }
    else{

      var clients = user.clients.split("/");
      var data = [];
      for(var i = 0; i < clients.length; i++){
        var client = clients[i].split("#")
        data.push({name: client[1], id: client[0]})
      }
      return (
        <Dropdown.Menu className="user-dropdown dropdown-menu-right mt-2">
          <Dropdown.Item id={props.id} onClick={signOut} className="fw-bold">
             Sign Out
          </Dropdown.Item>
          {data.map(t => <NavItem key={`${t.id}`} name={t.name} id={t.id} {...t} />)}
        </Dropdown.Menu>
      );
    }
  };

  return (
    <Navbar variant="dark" expanded className="ps-0 pe-2 pb-0">
      <Container fluid className="px-0">
        <div className="d-flex justify-content-between w-100">
          <div className="d-flex align-items-center">
            <h1>Creator Inventory Dashboard</h1>
          </div>
          <Nav className="align-items-center">
            <Dropdown as={Nav.Item}>
              <Dropdown.Toggle as={Nav.Link} className="pt-1 px-0">
                <div className="media d-flex align-items-center">
                  <Image src={"http://creatorinventory.com/dashboard/logos/"+user.img} className="user-avatar md-avatar rounded-circle" />
                  <div className="media-body ms-2 text-dark align-items-center d-none d-lg-block">
                    <span className="mb-0 font-small fw-bold">{user.name}</span>
                  </div>
                </div>
              </Dropdown.Toggle>
              <AdminNav />
            </Dropdown>
          </Nav>
        </div>
      </Container>
    </Navbar>
  );
};
