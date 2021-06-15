import React, { useState, useEffect, useContext } from "react";
import { Col, Row, Card, Form, Button, InputGroup } from '@themesberg/react-bootstrap';
import { UserContext } from "../pages/UserContext";


export const GeneralInfoForm = (props) => {
  //Form items
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [paypal_email, setPaypal_Email] = useState("");
  const [ss_api, setSS_Api] = useState("");
  const [shopify_site, setShopify_Site] = useState("");
  //User
  const {userSettings, id} = props;
  //User
  const {user, setUser} = useContext(UserContext);

  useEffect(() => {
    setFirstname(userSettings.firstname);
    setLastname(userSettings.lastname);
    setEmail(userSettings.email);
    setPaypal_Email(userSettings.paypal_email);
    setSS_Api(userSettings.ss_api);
    setShopify_Site(userSettings.shopify_site);

  },[])

  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <h5 className="mb-4">General information</h5>
        <Form>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>First Name</Form.Label>
                <Form.Control id="firstname" value={firstname} onChange={e => setFirstname(e.target.value)} required type="text" placeholder="Enter your first name"/>
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group >
                <Form.Label>Last Name</Form.Label>
                <Form.Control id="lastname" value={lastname} onChange={e => setLastname(e.target.value)} required type="text" placeholder="Also your last name" />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={12} className="mb-3">
              <Form.Group >
                <Form.Label>Email</Form.Label>
                <Form.Control id="email" value={email} onChange={e => setEmail(e.target.value)} required type="text" placeholder="name@company.com" />
              </Form.Group>
            </Col>
          </Row>

          <h5 className="my-4">Stream Alert and Payment Information</h5>
          <Row>
            <Col md={12} className="mb-3">
              <Form.Group >
                <Form.Label>Paypal Email</Form.Label>
                <Form.Control id="paypal" value={paypal_email} onChange={e => setPaypal_Email(e.target.value)} required type="text" placeholder="Enter your paypal email" />
              </Form.Group>
            </Col>
            <Col md={12} className="mb-3">
              <Form.Group >
                <Form.Label>Squarespace API Key</Form.Label>
                <Form.Control id="ss" value={ss_api} onChange={e => setSS_Api(e.target.value)} required type="text" placeholder="Enter your Squarespace API Key" />
              </Form.Group>
            </Col>
            <Col md={12} className="mb-3">
              <Form.Group >
                <Form.Label>Shopify site URL</Form.Label>
                <Form.Control id="shopify" value={shopify_site} onChange={e => setShopify_Site(e.target.value)} required type="text" placeholder="Enter your Shopify site url" />
              </Form.Group>
            </Col>
          </Row>
          <div className="mt-3">
            <Button variant="primary" type="button" onClick={updateDB}>Save All</Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );

  async function updateDB(){
    var updates = ""
    var tmpUser = user;
    if(document.getElementById("firstname").value !== ""){
      updates = updates +"&firstname=" + document.getElementById("firstname").value;
      tmpUser.settings.firstname = document.getElementById("firstname").value;
    }
    if(document.getElementById("lastname").value !== ""){
      updates = updates +"&lastname=" + document.getElementById("lastname").value;
      tmpUser.settings.lastname = document.getElementById("lastname").value;
    }
    if(document.getElementById("email").value !== ""){
      updates = updates +"&email=" + document.getElementById("email").value;
      tmpUser.settings.email = document.getElementById("email").value;
    }
    if(document.getElementById("paypal").value !== ""){
      updates = updates +"&paypal=" + document.getElementById("paypal").value;
      tmpUser.settings.paypal_email = document.getElementById("paypal").value;
    }
    if(document.getElementById("ss").value !== ""){
      //updates = updates +"&ss=" + document.getElementById("ss").value;
      //tmpUser.settings.ss_api = document.getElementById("ss").value;
    }
    if(document.getElementById("shopify").value !== ""){
      //updates = updates +"&shopify=" + document.getElementById("shopify").value;
      //tmpUser.settings.shopify_site = document.getElementById("shopify").value;
    }

    console.log(updates)
    setUser(tmpUser);
    if(updates !== ""){
      queryDB(updates, "", "settings", id);
    }

  }

  async function queryDB(start, end, q, id){
      //Building API Call
      var url = "https://d7rc7vsgld.execute-api.us-west-2.amazonaws.com/dev/q?id=" + id;
      url += "&q="+q
      url += start;
      //console.log(url)
      //Making Call
      const Response = await new Promise((resolve, reject) => {
    	var req = fetch(url, {
    		method: 'GET', // *GET, POST, PUT, DELETE, etc.
    		mode: 'cors', // no-cors, *cors, same-origin
    		cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    		credentials: 'same-origin', // include, *same-origin, omit
    		headers: {
    		  'Content-Type': 'text/plain',
    		  // 'Content-Type': 'application/x-www-form-urlencoded',
    		},
    		redirect: 'follow', // manual, *follow, error
    		referrerPolicy: 'no-referrer' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    	});
    	req.then((result) => {
    	    var res = result.json()
    	    res.then((tmp) => {
    	        resolve({
        		    statusCode: 200,
        		    body: JSON.stringify(tmp, null, 4)
        	    });
    	    });
    	});
      });
      var tmp = (JSON.parse(Response.body));
      return tmp;
  }
};
