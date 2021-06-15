import React, { useContext, useEffect } from "react";
import { Col, Row } from '@themesberg/react-bootstrap';
import { Routes } from "../routes";
import { UserContext } from "./UserContext";

export default (props) => {

  //User
  const {user} = useContext(UserContext);

  useEffect(() => {
    //Making sure we're logged in
    if(user.id === undefined || user.id===""){
      props.history.push({pathname: Routes.Signin.path});
    }
  });

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-md-0">
          <h4>Payouts</h4>
          <p className="mb-0">Pay yourself, with the click of a button!</p>
        </div>
      </div>

      <div className="table-settings mb-4">
        <Row className="justify-content-between align-items-center">
          <Col className="d-flex justify-content-md-center">
            <h1> Coming Soon! </h1>
          </Col>
        </Row>
      </div>


    </>
  );
};

//<h4>Payout history</h4>
//<TransactionsTable data={[]}/>
