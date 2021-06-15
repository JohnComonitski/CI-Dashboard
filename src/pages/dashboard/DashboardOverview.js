
import React, { useState, useEffect, useContext } from 'react';
import { faCashRegister, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Button } from '@themesberg/react-bootstrap';
import { CounterWidget, CircleChartWidget, SalesValueWidget, SalesValueWidgetPhone } from "../../components/Widgets";
import { TransactionsTable } from "../../components/Tables";
import { Routes } from "../../routes";
import { UserContext } from "../UserContext";

export default (props) => {

  const emptyPackage = {
    today: {rows:[{sales:0, day:"", profit:0, product_id:""}], period:""},
    sales: {firstDay: "", lastDay: "", total: 0,days:{sales:0, day:"", profit:0, product_id:""}},
    campaigns: [],
    products:{}
  }

  //User
  const {user, setUser} = useContext(UserContext);
  //UI Widgets
  const [overview, setOverview] = useState(emptyPackage.today);
  const [sales, setSales] = useState(emptyPackage.sales);
  const [campaigns, setCampaigns] = useState(emptyPackage.campaigns);
  const [productsNames, setProductsNames] = useState(emptyPackage.products);

  useEffect(() => {
    //Making sure we're logged in
    if((props.history.location.state === undefined) && (user.id === undefined || user.id==="")){
      props.history.push({pathname: Routes.Signin.path});
    }
    else{
      (async () => {
        var channel_id;
        if(props.history.location.state === undefined){
          channel_id = user.id
        }
        else{
          channel_id = props.history.location.state;
        }
        //Setting log in Package
        var today = new Date();
        var date = formatDate(today);
        today.setDate(today.getDate() - 6)
        var prevDate = formatDate(today);
        var data = await new Promise((resolve, reject) => {
          var req = queryDB(prevDate, date, "login", channel_id);
          req.then((result) => {
            resolve({
              statusCode: 200,
              body: JSON.stringify(result, null, 4)
            });
          });
        });
        //Setting up user
        var logInPackage = JSON.parse(data.body)
        logInPackage.sales["firstDay"] = prevDate
        logInPackage.sales["lastDay"] = date
        logInPackage.today.period = date
        setUser({id:props.history.location.state, name:logInPackage.client.rows[0].yt_name, img: logInPackage.client.rows[0].logo, rate: logInPackage.client.rows[0].rate, settings:logInPackage.client.rows[0], admin: logInPackage.client.rows[0].admin, clients: logInPackage.clients})
        //Setting up UI
        setProductsNames(getProductNames(logInPackage.campaigns))
        setOverview(prepToday(logInPackage.today, productsNames));
        setSales(prepSales(logInPackage.sales));
        setCampaigns(prepCampaigns(logInPackage.campaigns,logInPackage.client.rows[0].rate));

      })()
    }
  },[])


  //Button Events
  async function overviewToday(){
    //change color
    var classname = document.getElementById("1").className;
    classname = classname.replace("btn-secondary","btn-primary");
    document.getElementById("1").className = classname;

    classname = document.getElementById("2").className;
    classname = classname.replace("btn-primary","btn-secondary");
    document.getElementById("2").className = classname;

    classname = document.getElementById("3").className;
    classname = classname.replace("btn-primary","btn-secondary");
    document.getElementById("3").className = classname;

    //Getting today
    var today = new Date();
    var date = formatDate(today);

    var data = await queryDB(date, "", "sales", user.id);
    data.period = "date";
    if(data.rows.length === 0){
      setOverview(prepToday({rows:[{sales:0, day:date, profit:0, product_id:""}],period: date}, {}));
    }
    else{
      setOverview(prepToday(data, productsNames))
    }
  }
  async function overviewWeek(){
    //change color
    var classname = document.getElementById("1").className;
    classname = classname.replace("btn-primary","btn-secondary");
    document.getElementById("1").className = classname;

    classname = document.getElementById("2").className;
    classname = classname.replace("btn-secondary","btn-primary");
    document.getElementById("2").className = classname;

    classname = document.getElementById("3").className;
    classname = classname.replace("btn-primary","btn-secondary");
    document.getElementById("3").className = classname;

    //Getting today
    var today = new Date();
    var date = formatDate(today);
    today.setDate(today.getDate() - 6)
    var prevDate = formatDate(today);

    var data = await queryDB(prevDate, date, "sales", user.id);
    data.period = "This week"
    if(data.rows.length === 0){
      setOverview(prepToday({rows:[{sales:0, day:date, profit:0, product_id:""}], period:"This Week"},{}));
    }
    else{
      setOverview(prepToday(data, productsNames))
    }
  }
  async function overviewMonth(){
    //change color
    var classname = document.getElementById("1").className;
    classname = classname.replace("btn-primary","btn-secondary");
    document.getElementById("1").className = classname;

    classname = document.getElementById("2").className;
    classname = classname.replace("btn-primary","btn-secondary");
    document.getElementById("2").className = classname;

    classname = document.getElementById("3").className;
    classname = classname.replace("btn-secondary","btn-primary");
    document.getElementById("3").className = classname;

    //Getting today
    var today = new Date();
    var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    var lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    var date = formatDate(firstDay);
    var prevDate = formatDate(lastDay);

    var data = await queryDB(date, prevDate, "sales", user.id);
    data.period = "This month"
    if(data.rows.length === 0){
      setOverview(prepToday({rows:[{sales:0, day:date, profit:0, product_id:""}],period:"This month"},{}));
    }
    else{
      setOverview(prepToday(data, productsNames))
    }
  }
  async function salesWeek(){
    //change color
    var classname = document.getElementById("4").className;
    classname = classname.replace("btn-secondary","btn-primary");
    document.getElementById("4").className = classname;

    classname = document.getElementById("5").className;
    classname = classname.replace("btn-primary","btn-secondary");
    document.getElementById("5").className = classname;

    classname = document.getElementById("6").className;
    classname = classname.replace("btn-primary","btn-secondary");
    document.getElementById("6").className = classname;

    //Getting today
    var today = new Date();
    var date = formatDate(today);
    today.setDate(today.getDate() - 6)
    var prevDate = formatDate(today);

    var data = await queryDB(prevDate, date, "sales", user.id);
    if(data.rows.length === 0){
      setSales(prepSales({firstDay:"", lastDay:"", rows:[{sales:0, day:date, profit:0, product_id:""}]}));
    }
    else{
      data["firstDay"] = prevDate;
      data["lastDay"] = date;
      setSales(prepSales(data))
    }
  }
  async function salesMonth(){
    //change color
    var classname = document.getElementById("4").className;
    classname = classname.replace("btn-primary","btn-secondary");
    document.getElementById("4").className = classname;

    classname = document.getElementById("5").className;
    classname = classname.replace("btn-secondary","btn-primary");
    document.getElementById("5").className = classname;

    classname = document.getElementById("6").className;
    classname = classname.replace("btn-primary","btn-secondary");
    document.getElementById("6").className = classname;

    //Getting today
    var today = new Date();
    var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    var lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    var date = formatDate(firstDay);
    var prevDate = formatDate(lastDay);

    var data = await queryDB(date, prevDate, "sales", user.id);
    if(data.rows.length === 0){
      setSales(prepSales({firstDay:"", lastDay:"", rows:[{sales:0, day:date, profit:0, product_id:""}]}));
    }
    else{
      data["firstDay"] = date;
      data["lastDay"] = prevDate;
      setSales(prepSales(data))
    }
  }
  async function salesCustom(e, range){
    //console.log(range)
    //change color
    var classname = document.getElementById("4").className;
    classname = classname.replace("btn-primary","btn-secondary");
    document.getElementById("4").className = classname;

    classname = document.getElementById("5").className;
    classname = classname.replace("btn-secondary","btn-secondary");
    document.getElementById("5").className = classname;

    classname = document.getElementById("6").className;
    classname = classname.replace("btn-secondary","btn-primary");
    document.getElementById("6").className = classname;

    var start = range.startDate;
    var end = range.endDate;
    var date = formatDate(new Date(start));
    var prevDate = formatDate(new Date(end));

    var data = await queryDB(date, prevDate, "sales", user.id);
    if(data.rows.length === 0){
      setSales(prepSales({firstDay:"", lastDay:"", rows:[{sales:0, day:date, profit:0, product_id:""}]}));
    }
    else{
      data["firstDay"] = date;
      data["lastDay"] = prevDate;
      setSales(prepSales(data))
    }
  }

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <h2> Sales Overview</h2>

        <div className="d-flex ms-auto">
            <Button id="1" variant="primary" size="sm" className="me-2" onClick={overviewToday}>Today</Button>
            <Button id="2" variant="secondary" size="sm" className="me-2" onClick={overviewWeek}>This Week</Button>
            <Button id="3" variant="secondary" size="sm" className="me-3" onClick={overviewMonth}>This Month</Button>
        </div>
      </div>

      <Row className="justify-content-md-center">
      <Col xs={12} sm={6} xl={4} className="mb-4">
          <CounterWidget
            category="Sales"
            title={overview.sales}
            period={overview.period}
            percentage={0}
            icon={faChartLine}
            iconColor="shape-secondary"
          />
        </Col>

        <Col xs={12} sm={6} xl={4} className="mb-4">
          <CounterWidget
            category="Profit"
            title={(parseInt(overview.profit) * user.rate).toFixed(2)}
            period={overview.period}
            percentage={28.4}
            icon={faCashRegister}
            iconColor="shape-tertiary"
          />
        </Col>

        <Col xs={12} sm={6} xl={4} className="mb-4">
          <CircleChartWidget
            title="Products"
            data={overview.products} />
        </Col>

        <Col xs={12} className="mb-4 d-none d-sm-block">
          <SalesValueWidget
            title="Sales Profit"
            value={sales.total * user.rate}
            data={sales.days}
            custom={salesCustom}
            week={salesWeek}
            month={salesMonth}
          />
        </Col>
        <Col xs={12} className="mb-4 d-sm-none">
          <SalesValueWidgetPhone
            title="Sales Value"
            value={sales.total * user.rate}
            data={sales.days}
            custom={salesCustom}
            week={salesWeek}
            month={salesMonth}
          />
        </Col>
      </Row>

      <Row>
        <Col xs={12} xl={12} className="mb-4">
          <Row>
            <TransactionsTable data={campaigns} />
          </Row>
        </Col>
      </Row>
    </>
  );
};

function prepToday(data, productsNames){
  var products = {};
  var tmp = {"sales": 0, "profit": 0, "products":[],"date":formatDate(new Date())};
  for(var i = 0; i < data.rows.length; i++){
    tmp["sales"] = tmp["sales"] + data.rows[i].sales;
    tmp["profit"] = tmp["profit"] + data.rows[i].profit;

    if(products[data.rows[i].product_id]===undefined){
      products[data.rows[i].product_id] = data.rows[i].sales;
    }
    else{
      products[data.rows[i].product_id] = data.rows[i].sales + products[data.rows[i].product_id];
    }
  }
  if(tmp.sales !== 0){
    i = 0;
    for(const product in products){
      tmp.products.push({"id": i+1, "label": productsNames[product], "value": products[product]})
      i = i+1;
    }
  }

  tmp.period = data.period;
  return tmp;
}

function prepSales(data){
  var tmp = {"total": 0, "days": {"labels" :[], "series": []}};
  var days = {};

  //Create days data structure
  if(data.firstDay !== ""){
    var start = new Date(data.firstDay);
    start.setDate(start.getDate() +1);
    var end = new Date(data.lastDay);
    end.setDate(end.getDate() +1);

    var loop = new Date(start);
    while(loop <= end){
       var date = formatDate(loop);
       date = date.substring(5,7) + "/" + date.substring(8,10)
       days[date] = 0;
       var newDate = loop.setDate(loop.getDate() + 1);
       loop = new Date(newDate);
    }
  }

  //fill in dates
  for(var i = 0; i < data.rows.length; i++){
    tmp.total = tmp.total + data.rows[i].profit
    date = data.rows[i].day.substring(5,7) + "/" + data.rows[i].day.substring(8,10);
    if(days[date] === undefined){
      days[date] = data.rows[i].sales;
    }
    else{
      days[date] = days[date] + data.rows[i].sales;
    }
  }

  var series = [];
  for(const day in days){
    tmp.days.labels.push(day);
    series.push(days[day]);
  }
  tmp.days.series.push(series);
  return tmp;
}

function prepCampaigns(data, rate){
  var tmp = [];
  for(var i = 0; i < data.rows.length; i++){
    var row = {"products": data.rows[i].img_url, "day": data.rows[i].start_date.substring(0,10), "sales": data.rows[i].sales, "profit": (data.rows[i].profit * rate).toFixed(2)};
    tmp.push(row);
  }

  return tmp;
}

function getProductNames(data){
  var tmp = {}
  for(var i = 0; i < data.rows.length; i++){
    tmp[data.rows[i].product_id] = data.rows[i].short_name
  }
  return tmp;
}

async function queryDB(start, end, q, id){
    //Building API Call
    var url = "https://d7rc7vsgld.execute-api.us-west-2.amazonaws.com/dev/q?id=" + id;
    if(q !== ""){
      url += "&q="+q
    }
    if(start !== ""){
      url += "&start="+start
    }
    if(end !== ""){
      url += "&end="+end
    }

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

function formatDate(day){
  var date;
  if(day.getMonth() < 9){
    date = day.getFullYear()+'-0'+(day.getMonth()+1)
  }
  else{
    date = day.getFullYear()+'-'+(day.getMonth()+1)
  }
  if(day.getDate() < 9){
    date = date +'-0'+day.getDate();
  }
  else{
    date = date +'-'+day.getDate();
  }

  return date;
}
