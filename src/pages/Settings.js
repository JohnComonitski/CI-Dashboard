import React, { useState, useContext, useEffect } from "react";
import { Col, Row } from '@themesberg/react-bootstrap';
import { GeneralInfoForm } from "../components/Forms";
import { Routes } from "../routes";
import { UserContext } from "./UserContext";

export default (props) => {

  //User
  const {user} = useContext(UserContext);
  //User Settings
  const [info, setInfo] = useState({birthday:"",email:"",firstname:"",lastname:"",gender:"0",paypal_email:"", shopify_site:"", ss_api:""})
  const [id, setId] = useState("")

  useEffect(() => {
    //Making sure we're logged in 
    //console.log(user)
    if(user.id === undefined || user.id===""){
      props.history.push({pathname: Routes.Signin.path});
    }
    setInfo(user.settings)
    //setId(user.id);

  });


  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <h3 >Account Settings</h3>
      </div>

      <Row>
        <Col xs={12} xl={8}>
          <GeneralInfoForm userSettings={info} id={user.id}/>
        </Col>
      </Row>
    </>
  );
};
