
import React, { useState, useEffect, useContext } from 'react';
import { Col, Row, Card, Form, Button, Dropdown } from '@themesberg/react-bootstrap';
import { UserContext } from "./UserContext";
import { AlertTable } from "../components/AlertWidgets"
import { Routes } from "../routes";
import $ from 'jquery';

export default (props) => {
  //User
  const {user} = useContext(UserContext);
  //Relect the control center
  const [settings, setSettings] = useState({action: "bought", addstroke: "false", animation: "wave", background: "none", client_id: "", code: "OWNER", color: "#000000", custom: "null", font: "Bebas Neue/BebasNeue-Regular.ttf", shadow: true, sound: "bits.mp3", stroke: "#000000", volume: 0});
  //Relfect the state of all user settings
  const [defaultSettings, setDefaultSettings] = useState({});
  const [productSettings, setProductSettings] = useState([{}]);
  //List of user alerts
  const [alertList, setAlertList] = useState([]);
  const [alertNamesTimeout, setAlertNamesTimeout] = useState(0);
  //Display
  const [backgroundImg, setBackgroundImg] = useState("none");
  const [showBackground, setShowBackground] = useState("")
  const [textColor, setTextColor] = useState({});
  //AlertControls
  const [prod, setProd] = useState("Default")
  const [useDefault, setDefault] = useState(false);
  const [background, setBackground] = useState(settings.background);
  const [animation, setAnimation] = useState(settings.animation);
  const [sound, setSound] = useState(settings.sound);
  const [font, setFont] = useState(settings.font);
  const [color, setColor] = useState(settings.color);
  const [stroke, setStroke] = useState(typelessBool(settings.addstroke));
  const [strokeColor, setStrokeColor] = useState(settings.stroke);
  const [dropShadow, setDropShadow] = useState(typelessBool(settings.shadow));
  const [volume, setVolume] = useState(settings.volume);
  const [message, setMessage] = useState(settings.message);
  const [showSettings, setShowSettings] = useState("")

  //Sets up Controls
  useEffect(() => {
    (async() => {
      //Making sure we're logged in
      if(user.id === undefined || user.id===""){
        props.history.push({pathname: Routes.Signin.path});
      }

      //Default Settings
      var tmp = await getSettings(user.id);
      setSettings(tmp);
      setDefaultSettings(tmp);
      updateControl(tmp)

      //Product productSettings
      var productsTab = document.getElementById("product")
      tmp = await getProductSettings(user.id);
      for (var i = 0; i < tmp.rows.length; i++){
    		var option = document.createElement("option");
    		option.text = tmp.rows[i].short_name
    		option.label = tmp.rows[i].short_name
    		option.value = tmp.rows[i].short_name
        productsTab.add(option)
    	}
      setProductSettings(tmp.rows);

      getAlertNames(user.id, setAlertList)
    })()
    return function cleanUp(){
      clearTimeout(alertNamesTimeout);
    }
  },[])

  //Updates Display
  useEffect(() => {
    //Dislay
    setTextColor(textStyle(settings))
    changeFont(settings.font)
    //Change background image;
    if(background === "none" || background === "None"){
      setShowBackground("d-none")
      setBackgroundImg("")
    }
    else{
      setShowBackground("")
      setBackgroundImg("http://creatorinventory.com/alerts/backgrounds/"+settings.background)
    }
  },[color,font,stroke,strokeColor,dropShadow,background,message,prod]);

  function textStyle(settings) {
    var style = {color: settings.color};
    if(typelessBool(settings.shadow)){
      style.textShadow = "2px 2px 4px black";
    }
    if(typelessBool(settings.addstroke)){
      style.webkitTextStroke = `1px ${settings.stroke}`;
    }
    return style;
  }
  function changeFont(font){
    if(font !== "null"){
      var face = font
      var newStyle = document.createElement('style');
      newStyle.appendChild(document.createTextNode(`\
      @font-face {\
        font-family: ` + face.split("/")[0] + `;\
        src: url('http://creatorinventory.com/alerts/fonts/` + face.split("/")[1] + `') format('truetype');\
      }\
      `));
      document.head.appendChild(newStyle);
      document.getElementById('name').style.fontFamily = face.split("/")[0];
      document.getElementById('item').style.fontFamily = face.split("/")[0];
      document.getElementById('action').style.fontFamily = face.split("/")[0];
    }
    else{
      document.getElementById('name').style.fontFamily = "";
      document.getElementById('item').style.fontFamily = "";
      document.getElementById('action').style.fontFamily = "";
    }
  }
  function updateMessage(settings){
    var messageBox = document.getElementById("message");
    messageBox.value = "Name "
    var readOnlyLength = $('#message').val().length;
    messageBox.value = messageBox.value + settings.action;
    $('#message').on('keypress, keydown', function(event) {
      var $message = $(this);
      $('#output').text(event.which + '-' + this.selectionStart);
      if ((event.which !== 37 && (event.which !== 39))
        && ((this.selectionStart < readOnlyLength)
        || ((this.selectionStart === readOnlyLength) && (event.which === 8)))) {
        return false;
      }
    });
    setMessage(messageBox.value.substring(5))
  }
  function typelessBool(val){
    if(val === true || val === "true" || val === "True" || val === "TRUE"){
      return true
    }
    else if(val === false || val === "false" || val === "False" || val === "FALSE"){
      return false
    }
    else{
      console.log("bad bool:",val)
      return val
    }
  }
  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <h2> Stream Alerts</h2>

        <div className="d-flex ms-auto">
            <Button variant="secondary" size="sm" className="me-2" onClick={saveSettings} >Save</Button>
            <Button variant="secondary" size="sm" className="me-2" onClick={testAlert} >Test</Button>
        </div>
      </div>

      <Row className="justify-content-md-center">
        <Col xs={12} className="mb-4">
          <Card border="light" className="shadow-sm">
            <Card.Body style={{marginLeft:"auto", marginRight:"auto"}} >
              <div id = "alertDisplay">
                <div id = "alertContainer">
                  <img id="alertBg" alt="alertbg" className = {"float "+showBackground} src={backgroundImg}/>
                  <div id = "c" className = "float">
                    <div id="alert">
                      <div id = "top">
                        <h1 className = 'varText' style={textColor} id = "name">{"Name "}</h1>
                        <h1 className = "staticText" style={textColor} id = "action">{message}</h1>
                      </div>
                      <div id = "gif">
                        <img src="" alt="product" id = "img"/>
                      </div>
                      <div id = "bottom" >
                        <h1 className = 'varText' style={textColor} id = "item">Product Name!</h1>
                        <h1 className = 'staticText' style={textColor} id = "code"> </h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col xs={12} className="mb-4">
          <Card border="light" className="shadow-sm">
            <Card.Body>
              <h5 className="mb-4">Alert Settings</h5>
              <Form>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group >
                    <Form.Label>Product</Form.Label>
                    <Form.Select id="product" defaultValue={prod} onChange={e => {setProd(e.target.value); updateSettings();} }>
                      <option value="Default">Default</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group >
                    <Form.Label>Use Default Settings</Form.Label>
                    <Form.Check id="default" type="checkbox" onChange={(event) => {useDefaultBtn(event.currentTarget.checked);}} checked={useDefault}/>
                  </Form.Group>
                </Col>
              </Row>
              <Dropdown.Divider className={showSettings+"my-3 border-indigo"} />
              <Row className={showSettings}>
                <Col md={6} className="mb-3">
                  <Form.Group className={showSettings}>
                    <Form.Label>Background</Form.Label>
                    <Form.Select id="background" value={background} onChange={e => {var tmp = settings; tmp.background = e.target.value; setBackground(e.target.value); setSettings(tmp);}}>
                      <option value="None">None</option>
                      <option value="slide.png">Slide</option>
                      <option value="wall.png">Wall</option>
                      <option value="black.png">Black</option>
                      <option value="white.png">White</option>
                      <option value="partyparot.gif">Party Parrot</option>
                      <option value="neonpop.gif">Neon Pop</option>
                      <option value="sparkle.gif">Sparkles</option>
                      <option value="stars.gif">Stars</option>
                      <option value="vaporwave.gif">Vapor Wave</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group className={showSettings}>
                    <Form.Label>Animation</Form.Label>
                    <Form.Select id="animation" value={animation} onChange={e => {var tmp = settings; tmp.animation = e.target.value; setAnimation(e.target.value); setSettings(tmp);}}>
                      <option value="0">Default</option>
                      <option value="wave">Wave</option>
                      <option value="appear">Appear</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row className={showSettings}>
                <Col md={6} className="mb-3">
                  <Form.Group className={showSettings}>
                    <Form.Label>Sound</Form.Label>
                    <Form.Select id="sound" value={sound} onChange={e => {var tmp = settings; tmp.sound = e.target.value; setSound(e.target.value); setSettings(tmp);}}>
                      <option value="blops.mp3">Blops</option>
                      <option value="firesale.mp3">Fire Sale</option>
                      <option value="darkaether.mp3">Dark Aether</option>
                      <option value="bits.mp3">Bits</option>
                      <option value="gong.mp3">Gong</option>
                      <option value="text.mp3">Text Message</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group className={showSettings}>
                    <Form.Label>Font</Form.Label>
                    <Form.Select id="font" value={font} onChange={e => {var tmp = settings; tmp.font = e.target.value; setFont(e.target.value); setSettings(tmp);}}>
                      <option value="null">Default</option>
                      <option value="digits/digits.ttf">Digits</option>
                      <option value="Bebas Neue/BebasNeue-Regular.ttf">Bebas Neue</option>
                      <option value="aAttackGraffiti/aAttackGraffiti.ttf">Graffiti</option>
                      <option value="Vogue/Vogue.ttf">Vogue</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row className={showSettings}>
                <Col md={6} className="mb-3">
                  <Form.Group className={showSettings}>
                    <Form.Label>Message</Form.Label>
                    <Form.Control id="message"  required type="text"  onChange={e => {var tmp = settings; tmp.action = e.target.value; setMessage(e.target.value.substring(5)); setSettings(tmp);}}/>
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group className={showSettings}>
                    <Form.Label>Volume</Form.Label>
                    <Form.Control id="volume" required type="range" value={volume} onChange={e => {var tmp = settings; tmp.volume = e.target.value; setVolume(e.target.value); setSettings(tmp);}}/>
                  </Form.Group>
                </Col>
              </Row>
              <Row className={showSettings}>
                <Col md={3} className="mb-3">
                  <Form.Group className={showSettings}>
                    <Form.Label>Color</Form.Label>
                    <Form.Control id="color" required type="color" value={color} onChange={e => {var tmp = settings; tmp.color = e.target.value; setColor(e.target.value); setSettings(tmp);}}/>
                  </Form.Group>
                </Col>
                <Col md={3} className="mb-3">
                  <Form.Group className={showSettings}>
                    <Form.Label>Drop Shadow</Form.Label>
                    <Form.Check id="shadow" required type="checkbox" checked={dropShadow} onChange={e => {var tmp = settings; tmp.shadow = e.target.checked; setDropShadow(typelessBool(e.target.checked)); setSettings(tmp);}}/>
                  </Form.Group>
                </Col>
                <Col md={3} className="mb-3">
                  <Form.Group className={showSettings}>
                    <Form.Label>Stroke</Form.Label>
                    <Form.Check id="stroke" required type="checkbox" checked={stroke} onChange={e => {var tmp = settings; tmp.addstroke = e.target.checked; setStroke(typelessBool(e.target.checked)); setSettings(tmp);}}/>
                  </Form.Group>
                </Col>
                <Col md={3} className="mb-3">
                  <Form.Group className={showSettings}>
                    <Form.Label>Stroke Color</Form.Label>
                    <Form.Control id="stroke-color" required type="color" value={strokeColor} onChange={e => {var tmp = settings; tmp.stroke = e.target.value; setStrokeColor(e.target.value); setSettings(tmp);}}/>
                  </Form.Group>
                </Col>
              </Row>

              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col >
          <Card border="light" className="bg-white shadow-sm mb-4">
            <Card.Body>
              <h5 className="mb-4">Alert Link</h5>
              <Form>
                <Row>
                  <Col xs={10} className="mb-3">
                    <Form.Group >
                      <Form.Control id="link" value={"https://creatorinventory.com/alerts/"+user.id.toLowerCase()} required type="text" />
                    </Form.Group>

                  </Col>
                  <Col xs={2} className="mb-3">
                    <Button variant="primary" onClick={copyLink}type="button" >Copy</Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>


      <Row>
        <Col xs={12} xl={12} className="mb-4">
          <Card border="light" className="bg-white shadow-sm mb-4">
            <Card.Body>
              <h5 className="mb-4">Most recent alerts</h5>
              <Row>
                <AlertTable data={alertList} />
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );

  function copyLink(){
    var linkHolder = document.getElementById("link")
    linkHolder.select();
    linkHolder.setSelectionRange(0, 99999); /* For mobile devices */
    document.execCommand("copy");

    alert("Copied the text: " + linkHolder.value);
  }
  async function getAlertNames(id, setAlertList){
      //Get All Names
      var url = "https://rf8fbiwmr5.execute-api.us-west-2.amazonaws.com/dev/StreamAlert?id=" + id + "&mode=names";
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
      var allNames = JSON.parse(Response.body).rows;

      //Prep Names
      var tmp = [];
      for(var i = 0; i < allNames.length; i++){
        var row = {"date": allNames[i].date.substring(0,10), "name": allNames[i].name, "order": allNames[i].short_name};
        tmp.push(row);
      }

      setAlertList(tmp)
      setAlertNamesTimeout(setTimeout(getAlertNames, 20000, id, setAlertList));
  }

  //Settings and Controls Functions
  async function getSettings(id){
    var url = "https://rf8fbiwmr5.execute-api.us-west-2.amazonaws.com/dev/StreamAlert?id=" + id + "&mode=get";

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
  async function getProductSettings(id){
    var url = "https://rf8fbiwmr5.execute-api.us-west-2.amazonaws.com/dev/StreamAlert?id=" + id + "&mode=products";

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
  function updateControl(settings){
    updateMessage(settings);
    if(document.getElementById("product").value != "Default"){
      setDefault(settings.default_settings);
    }
    else{
      setDefault(false);
    }
    setBackground(settings.background);
    setAnimation(settings.animation);
    setSound(settings.sound);
    setFont(settings.font);
    setColor(settings.color);
    setStroke(settings.addstroke);
    setStrokeColor(settings.stroke);
    setDropShadow(settings.shadow);
    setVolume(settings.volume);
  }
  function useDefaultBtn(value){
    var product = document.getElementById("product").value
    if(product != "Default"){
      //Not a default product
      console.log(value)
      setDefault(value);
      //update Product mem
      for(var i=0; i<productSettings.length; i++){
        if(productSettings[i].short_name === product){
          var tmp = productSettings;
          tmp[i].default_settings = value
          setProductSettings(tmp);
          setSettings(productSettings[i]);
        }
      }
      //check if we need to swith to default and hide settings
      if(value){
        setSettings(defaultSettings);
        setShowSettings("d-none ")
      }
      else{

        setShowSettings("")
      }
    }
    else{
      //default, do nothing
      setDefault(false);
    }
  }
  function updateSettings(){
    var product = document.getElementById("product").value
    if(product === "Default"){
      setShowSettings("")
      setSettings(defaultSettings);
      updateControl(defaultSettings);
    }
    else{
      for(var i=0; i<productSettings.length; i++){
        if(productSettings[i].short_name === product){
          //check for show default
          setSettings(productSettings[i]);
          updateControl(productSettings[i])
          if(productSettings[i].default_settings){
            setShowSettings("d-none ")
          }
          else{
            setShowSettings("")
          }
        }
      }
    }
  }
  async function saveSettings(){
    var product = document.getElementById("product").value

  	var url = "https://rf8fbiwmr5.execute-api.us-west-2.amazonaws.com/dev/StreamAlert?id=" + user.id + "&mode=set";

  	if(product === "Default"){
  		url = url + "&animation=" + settings.animation;
  		url = url + "&background=" + settings.background;
  		url = url + "&sound=" + settings.sound;
  		url = url + "&font=" + settings.font;
  		url = url + "&volume=" + (settings.volume/100).toString();
  		url = url + "&code=" + settings.code;
  		url = url + "&color=" + (settings.color).substring(1);
  		url = url + "&action=" + settings.action.substring(5).trim();
  		url = url + "&stroke=" + (settings.stroke).substring(1);
  		url = url + "&addstroke=" + settings.addStrokes;
  		url = url + "&shadow=" + settings.shadow;
  		url = url + "&pid=default"

      setDefaultSettings(settings)
  	}
  	else{
  		if(settings.default_settings){
  			url = url + "&pid=" + settings.product_id;
  			url = url + "&usedefault=true"

  			for (var i = 0; i < productSettings.length; i++){
  				if(productSettings[i].short_name === product){
  					var tmp = productSettings;
            tmp[i].default_settings = true
            setProductSettings(tmp);
  				}
  			}
  		}
  		else{
        url = url + "&animation=" + settings.animation;
    		url = url + "&background=" + settings.background;
    		url = url + "&sound=" + settings.sound;
    		url = url + "&font=" + settings.font;
    		url = url + "&volume=" + (settings.volume/100).toString();
    		url = url + "&code=" + settings.code;
    		url = url + "&color=" + (settings.color).substring(1);
    		url = url + "&action=" + settings.action.substring(5).trim();
    		url = url + "&stroke=" + (settings.stroke).substring(1);
    		url = url + "&addstroke=" + settings.addStrokes;
    		url = url + "&shadow=" + settings.shadow;
        url = url + "&pid=" + settings.product_id;
  			url = url + "&usedefault=false"
  			url = url + "&shortname=" + settings.short_name;

        //Update Product Settings
        for (i = 0; i < productSettings.length; i++){
  				if(productSettings[i] === product){
  					tmp = productSettings;
            tmp[i] = settings;
            setProductSettings(tmp);
  				}
  			}
  		}
  	}

  	//Send request
  	await new Promise((resolve, reject) => {
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

  	alert("Alert settings saved!");
  }

  //Test Alert Button
  async function testAlert(){
    await runAnimation();
    const Alert = document.getElementById('alert');
    Alert.style.animation = "";
    const Gif = document.getElementById("gif")
    Gif.style.animation = "";
    const BG = document.getElementById("alertBg")
    BG.style.animation = "";
  }
  function runAnimation(){
    if(document.getElementById("alert").style.animation === ""){

  		//init
  		var animationLength = 21
  		const Alert = document.getElementById('alert');
  		Alert.style.animation = "none";
  		const Name = document.getElementById('name');
  		Name.innerHTML = "Name"
      const Action = document.getElementById('action');
      Action.innerHTML = message
  		const Product = document.getElementById('item');
  		Product.innerHTML = "Product Name!"
  		const Gif = document.getElementById("gif")
  		Gif.style.animation = "none";
  		const BG = document.getElementById("alertBg")
  		BG.style.animation = "none";

  		//animation prep
  		var animatedText = [];
  		animatedText.push(Name.innerHTML);
  		//var count = (Name.innerHTML.length)
  		Name.innerHTML = animatedTextPrep(Name.innerHTML,0);
      animatedText.push(Action.innerHTML);
  		//count += (Product.innerHTML.length)
  		Action.innerHTML = animatedTextPrep(Action.innerHTML,animatedText[0].length);
  		animatedText.push(Product.innerHTML);
  		//count += (Product.innerHTML.length)
  		Product.innerHTML = animatedTextPrep(Product.innerHTML,(animatedText[0].length + animatedText[1].length));

  		//Setting assests and settings
  		BG.src = "http://creatorinventory.com/alerts/backgrounds/"+settings.background;
  		var sound = "http://creatorinventory.com/alerts/sounds/"+settings.sound;
      sound = new Audio(sound);
  		sound.volume = settings.volume/100;
  		if(settings.animation === "wave"){
  			SetWaveAnimation(animatedText);
  		}
  		else if(settings.animation === "appear"){
  			setPopInAnimation(animatedText);
  		}
  		else if(settings.animation === "none"){
  			SetNoneAnimation(animatedText)
  		}
  		document.getElementById('name').style.color = settings.color;
  		document.getElementById('item').style.color = settings.color;

  		if(settings.font !== 'null'){
  			var newStyle = document.createElement('style');
  			newStyle.appendChild(document.createTextNode(`\
  			@font-face {\
  				font-family: ` + settings.font.split("/")[0] + `;\
  				src: url('http://creatorinventory.com/alerts/fonts/` + settings.font.split("/")[1] + `') format('truetype');\
  			}\
  			`));

  			document.head.appendChild(newStyle);
  			document.getElementById('name').style.fontFamily = settings.font.split("/")[0];
  			document.getElementById('item').style.fontFamily = settings.font.split("/")[0];
  		}
  		//img
  		document.getElementById("img").src = "http://creatorinventory.com/dashboard/product.png"

  		//fading in
  		BG.style.animation = "fadeIn " + animationLength +"s forwards 1";
  		Gif.style.animation = "fadeIn " + animationLength +"s forwards 1";
  		Alert.style.animation = "fadeIn " + animationLength +"s forwards 1";
  		sound.play()
  	}
    return;
  }
  //ALERT TEST FUNCTIONS AND ANIMATIONS
  function animatedTextPrep(letters, count){
  	var html = "";
  	for(var i =count; i < (letters.length+count); i++){
  		var Char = letters.charAt(i-count)
  		if(Char === " "){
  			Char = "&nbsp"
  		}
  		html += "<span id = \"" + i + "\">" + Char + "</span>";
  	}
  	return html
  }
  function SetNoneAnimation(animatedText){
  	var count = 0
  	for(var i =0; i < animatedText.length; i++){
  		var Text = animatedText[i];
  		for(var j = 0; j< Text.length; j++){
  			document.getElementById("" + count).style.opacity = 1;
  			count += 1;
  		}
  	}
  }
  function SetWaveAnimation(animatedText){
  	var count = 0
  	for(var i =0; i < animatedText.length; i++){
  		var Text = animatedText[i];
  		for(var j = 0; j< Text.length; j++){
  			document.getElementById("" + count).style.animation = "text-wave ease-in-out 2s forwards 10";
  			document.getElementById("" + count).style.animationDelay = (250*(j%8)) + "ms";
  			document.getElementById("" + count).style.opacity = 1;
  			count += 1;
  		}
  	}
  }
  function setPopInAnimation(animatedText){
  	var count = 0
  	for(var i =0; i < animatedText.length; i++){
  		var Text = animatedText[i];
  		for(var j = 0; j< Text.length; j++){
  			document.getElementById("" + count).style.animation = "pop-in ease .1s forwards";
  			document.getElementById("" + count).style.animationDelay = (100*(count)) + "ms";
  			count += 1;

  		}
  	}

  }


};
