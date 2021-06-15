
import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, } from "@fortawesome/free-solid-svg-icons";
import { Col, Row, Container, Form, Button} from '@themesberg/react-bootstrap';

import { Routes } from "../../routes";
import BgImage from "../../assets/img/illustrations/signin.svg";

//gAPI
import { gapi, loadGapiInsideDOM, loadClientAuth2, loadAuth2WithProps} from 'gapi-script'


export default (props) => {
  const CLIENT_ID = '640109321718-hi3cr72v38sa783htp8ihbd84qh6i56p.apps.googleusercontent.com';
  const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"];
  const SCOPES = 'https://www.googleapis.com/auth/youtube.readonly';

  useEffect(() => {

    const setAuth2 = async () => {
      const auth2 = await loadAuth2WithProps(gapi, {clientId:CLIENT_ID, scope:SCOPES, discoveryDocs:DISCOVERY_DOCS})
      if (auth2.isSignedIn.le === true) {
        //User is already signed in
        const gapi = await loadGapiInsideDOM();
        //Load Client
        await loadClientAuth2(gapi, CLIENT_ID, SCOPES, DISCOVERY_DOCS);
        //Get ID and push to Dashboard
        try{
          getYouTubeID();
        }
        catch(e){

        }
      }
      else {
        attachSignin(document.getElementById('signInBtn'), auth2);
      }
    }
    setAuth2();
  });

  const attachSignin = (element, auth2) => {
    auth2.attachClickHandler(element, {},
      async (googleUser) => {
        //Handle sign in
        const gapi = await loadGapiInsideDOM();
        //load client
        await loadClientAuth2(gapi, CLIENT_ID, SCOPES, DISCOVERY_DOCS);
        //Get ID and push to Dashboard
        try{
          getYouTubeID();
        }
        catch(e){

        }
      }, (error) => {
      console.log(JSON.stringify(error))
    });
  };

  async function getYouTubeID(){
    //Get youtube api
    new Promise(resolve => {
      gapi.client.load('youtube','v3')
      .then(() => {
        //Get YouTube ID
        gapi.client.youtube.channels.list({
          "part": [
            "snippet,contentDetails,statistics"
          ],
          "mine": true
        })
        .then(async function(response) {
            //response.result.items[0]['id']
            //Get channel ID and move to dashboar
            props.history.push({pathname: Routes.DashboardOverview.path, state: "UCMUP9j-QidC_S0KLlO06uCg"});
        });
      });
    });
  }

  return (
    <main>
      <section className="d-flex align-items-center my-5 mt-lg-6 mb-lg-5">
        <Container>
          <p className="text-center">
            <a href="https://creatorinventory.com/" className="text-gray-700"> <FontAwesomeIcon icon={faAngleLeft} className="me-2" /> Back to homepage </a>
          </p>
          <Row className="justify-content-center form-bg-image" style={{ backgroundImage: `url(${BgImage})` }}>
            <Col xs={12} className="d-flex align-items-center justify-content-center">
              <div className="bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                <div className="text-center text-md-center mb-4 mt-md-0">
                  <h3 className="mb-0">Sign in using YouTube</h3>
                </div>



                <Form className="mt-4">
                  <Button id="signInBtn" variant="primary" type="submit" className="w-100">
                    Log in with YouTube
                  </Button>
                </Form>

                <div className="mt-3 mb-4 text-center">
                  <span className="fw-normal">Welcome to the Creator Inventory dashboard. Enter by signing in with the Google account associated with your YouTube channel.</span>
                </div>

                <div className="d-flex justify-content-center align-items-center mt-4">
                  <span className="fw-normal">
                    View our
                      <a href="https://creatorinventory.com/privacy" className="text-gray-700"> Privacy Policy </a>
                  </span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
};
