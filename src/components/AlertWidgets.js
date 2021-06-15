
import React, { useState, useEffect } from "react";
import { Col, Card, Form, Table,} from '@themesberg/react-bootstrap';

export const AlertControls = (props) => {
  const { settings, setSettings, updateSettings } = props;
  const [useDefault, setDefault] = useState(settings.default_settings);

  const [background, setBackground] = useState(settings.background);
  const [animation, setAnimation] = useState(settings.animation);
  const [sound, setSound] = useState(settings.sound);
  const [font, setFont] = useState(settings.font);
  const [color, setColor] = useState(settings.color);
  const [stroke, setStroke] = useState(settings.addstroke);
  const [strokeColor, setStrokeColor] = useState(settings.stroke);
  const [dropShadow, setDropShadow] = useState(settings.shadow);
  const [volume, setVolume] = useState(settings.volume);
  const [message, setMessage] = useState(settings.message);

  useEffect(() => {
    setBackground(settings.background);
    setAnimation(settings.animation);
    setSound(settings.sound);
    setFont(settings.font);
    setColor(settings.color);
    setStroke(settings.addstroke);
    setStrokeColor(settings.stroke);
    setDropShadow(settings.shadow);
    setVolume(settings.volume);
    setMessage(settings.message);

  }, [settings]);

  const showSettings = useDefault ? "d-none " : "";

  return (
    <Card border="light" className="shadow-sm">
      <Card.Body>
        <h5 className="mb-4">Alert Settings</h5>
        <Form>
          <Col md={12} className="mb-3">
            <Form.Group >
              <Form.Label>Product</Form.Label>
              <Form.Select id="product" defaultValue={"Default"} onChange={updateSettings}>
                <option value="Default">Default</option>
              </Form.Select>
            </Form.Group>

            <Form.Group >
              <Form.Label>Use Default Settings</Form.Label>
              <Form.Check id="default" type="checkbox" onChange={(event) => setDefault(event.currentTarget.checked)} checked={useDefault}/>
            </Form.Group>

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

            <Form.Group className={showSettings}>
              <Form.Label>Animation</Form.Label>
              <Form.Select id="animation" value={animation} onChange={e => {var tmp = settings; tmp.animation = e.target.value; setAnimation(e.target.value); setSettings(tmp);}}>
                <option value="0">Default</option>
                <option value="wave">Wave</option>
                <option value="appear">Appear</option>
              </Form.Select>
            </Form.Group>

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

            <Form.Group className={showSettings}>
              <Form.Label>Color</Form.Label>
              <Form.Control id="color" required type="color" value={color} onChange={e => {var tmp = settings; tmp.color = e.target.value; setColor(e.target.value); setSettings(tmp);}}/>
            </Form.Group>

            <Form.Group className={showSettings}>
              <Form.Label>Stroke</Form.Label>
              <Form.Check id="stroke" required type="checkbox" checked={stroke} onChange={e => {var tmp = settings; tmp.addstroke = e.target.checked; setStroke(e.target.checked); setSettings(tmp);}}/>
            </Form.Group>

            <Form.Group className={showSettings}>
              <Form.Label>Stroke Color</Form.Label>
              <Form.Control id="stroke-color" required type="color" value={strokeColor} onChange={e => {var tmp = settings; tmp.stroke = e.target.value; setStrokeColor(e.target.value); setSettings(tmp);}}/>
            </Form.Group>

            <Form.Group className={showSettings}>
              <Form.Label>Drop Shadow</Form.Label>
              <Form.Check id="shadow" required type="checkbox" checked={dropShadow} onChange={e => {var tmp = settings; tmp.shadow = e.target.checked; setDropShadow(e.target.checked); setSettings(tmp);}}/>
            </Form.Group>

            <Form.Group className={showSettings}>
              <Form.Label>Volume</Form.Label>
              <Form.Control id="volume" required type="range" value={volume} onChange={e => {var tmp = settings; tmp.volume = e.target.value; setVolume(e.target.value); setSettings(tmp);}}/>
            </Form.Group>

            <Form.Group className={showSettings}>
              <Form.Label>Message</Form.Label>
              <Form.Control id="message" value={message} required type="text"  onChange={e => {var tmp = settings; tmp.action = e.target.value; setMessage(e.target.value); setSettings(tmp);}}/>
            </Form.Group>

          </Col>
        </Form>
      </Card.Body>
    </Card>
  );
};

export const AlertTable = (props) => {
  const { data } = props;

  const TableRow = (props) => {
    const { date, name, order } = props;

    return (
      <tr>
        <td>
          <span className="fw-normal">
            {date}
          </span>
        </td>
        <td>
          <span className="fw-normal">
            {name}
          </span>
        </td>
        <td>
          <span className="fw-normal">
            {order}
          </span>
        </td>
      </tr>
    );
  };

  return (
    <Card border="light" className="table-wrapper table-responsive shadow-sm">
      <Card.Body className="pt-0">
        <Table hover className="user-table align-items-center">
          <thead>
            <tr>
              <th className="border-bottom">Date</th>
              <th className="border-bottom">Name</th>
              <th className="border-bottom">Order</th>
            </tr>
          </thead>
          <tbody>
            {data.map(t => <TableRow key={`name-${t.name}`} {...t} />)}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};
