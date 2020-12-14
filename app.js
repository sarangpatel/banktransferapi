var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
const mysql = require('mysql2/promise');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password:'root',
  database: 'banktransfer',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


const preCheckReq = async (req, res, next) => {
  let { fromAccountId, toAccountId, amount } = req.body;
  if (fromAccountId && toAccountId && amount && Number.isInteger(fromAccountId) && Number.isInteger(toAccountId) 
    && parseFloat(amount) ) { 
    if(fromAccountId === toAccountId){
      var err = new Error('Source and Destination Account should not be same.');
      err.error_code = 2;
      err.status = 200;
      next(err);
    }else if(!checkSameUser(fromAccountId, toAccountId)){
      var err = new Error('Source and Destination Account are of same user.');
      err.error_code = 3;
      err.status = 200;
      next(err);
    }else{
      let fromAcc = await  getAccountDetail(fromAccountId);
      let toAcc =  await getAccountDetail(toAccountId);
      let finalAmt = toAcc['balance'] + amount;
      console.log(fromAcc['balance'],' === ', amount)
      if(fromAcc['balance'] >= amount){
        if(toAcc['type'] == 'BasicSavings' && finalAmt > 50000){
            var err = new Error('Destination BasicSavings account should not exceed Rs. 50000.');
            err.error_code = 5;
            err.status = 200;
            next(err);
        }else{
          next();
        }
      }else{
            var err = new Error('Source Account does not have enough balance to transfer.');
            err.error_code = 4;
            err.status = 200;
            next(err);
      }
    }
  }else{
    let err = new Error('Invalid input');
    err.error_code = 1;
    err.status = 200;
    next(err);
  }
};


//return true if different user
const checkSameUser = async (fromId, toId) => {
    let result = await pool.query('SELECT distinct user_id from accounts where account_id = ? OR account_id = ? ', [  fromId, toId  ]);
    result = result[0];
    console.log("same", result.length);
    if(result.length > 1)
      return true; 
    else
     return false;
};

const getAccountDetail = async (accountId) => {
    let result = await pool.query('SELECT * from accounts where account_id = ? ', [  accountId  ]);
    //console.log(result[0][0]);
    return result[0][0];
};

app.get('/getAccountDetail/:accountId', async (req, res, next) => {
  console.log('Inside getAccountDetail api', Date.now());
  console.log(req.params);
  let { accountId } = req.params;
  if (accountId &&  Number.isInteger(parseInt(accountId))) { 
      let result = await getAccountDetail(accountId);
      res.json({message:'success','data': result});
  }else{
      let err = new Error('Invalid input');
      err.error_code = 1;
      err.status = 200;
      next(err);
  }
});

app.post('/transferMoney', preCheckReq, async function (req, res, next) {
  console.log('Inside transferMoney api', Date.now());
  let { fromAccountId, toAccountId, amount } = req.body;
  let fromAcc =  await getAccountDetail(fromAccountId);
  let toAcc =  await getAccountDetail(toAccountId);
  let finalSrcAmt = fromAcc['balance'] - amount;
  let finalDestAmt = toAcc['balance'] + amount;
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  try {
      await connection.execute(`UPDATE accounts SET balance = ${finalSrcAmt} WHERE account_id = ${fromAccountId} `);
      await connection.execute(`UPDATE accounts SET balance = ${finalDestAmt} WHERE account_id = ${toAccountId} `);
      await connection.commit();
      let totalAmt = await pool.query('SELECT sum(balance) as totalAmt from accounts where user_id = ?', [  toAcc.user_id  ]);
      connection.release();
      res.json({errorCode:0, message:'Transferred Successfully','newSrcBalance': finalSrcAmt, 'totalDestBalance':  totalAmt[0][0]['totalAmt'], 'transferedAt': new Date() });
  } catch (err) {
    await connection.rollback();
    err = new Error('Error in updating DB table:' + err.message);
    err.error_code = 8;
    err.status = 200;
    next(err);    
  }finally{
     connection.release();
  }
});

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Route not found.');
    err.error_code = 2;
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json( {
    errorMessage: err.message,
    errorCode: err.error_code || 5
  });
});

// finally, let's start our server...
var server = app.listen( process.env.PORT || 3000, function(){
  console.log('Listening on port ' + server.address().port);
});
