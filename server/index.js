const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;
const EC = require('elliptic').ec;

const ec = new EC('secp256k1');
const sv = require('./signverify');

const key = [];
const pubKeyBal = {};

// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(express.json());

const balances = {
  "1": 100,

  "2": 50,
  "3": 75,

 }

console.log("Public Accounts");
console.log("------------------");
debugger;
let count = 0;
let pubAddress = "";
for (let acctAdd in balances){
key[count] = ec.genKeyPair();
pubAddress = key[count].getPublic().encode('hex').toString().slice(-40)
console.log("(" + acctAdd + ") "  + key[count].getPublic().encode('hex').toString().slice(-40) ) 
pubKeyBal[pubAddress] = balances[acctAdd]
count++

}

// for (let pubKeyy in pubKeyBal) {
// console.log(pubKeyBal[pubKeyy])
// }

console.log("Log Private Keys");
console.log("------------------");
count = 0;
for (let acctAdd in balances){
console.log("(" + acctAdd + ") "  + key[count].getPrivate().toString(16)) 
count++
}


app.get('/balance/:address', (req, res) => {
  const {address} = req.params;
  //console.log("Address :" + address)
  //const balance = balances[address] || 0;
  const balance = pubKeyBal[address] || 0;
  res.send({ balance });
});

app.post('/send', (req, res) => {
  const {sender, recipient, amount, privateKey} = req.body;
  //console.log('Private key received: ' + privateKey);
  //console.log('Sender: ' + sender);
  count = 0;
//for (let acctAdd in balances){
for (let pubAdd in pubKeyBal){
	//console.log('acctAdd: ' + acctAdd);
        //console.log(key[count].getPrivate().toString(16));
	if(pubAdd == sender){
		publicKey = key[count].getPublic().encode('hex')
		//console.log('publicKey : ' + publicKey );
	break;
	}else {
		count++;
	} 
  }
  if (sv.signVerify(privateKey, publicKey)){
	console.log("Message Verified");
	//balances[sender] -= amount;
	pubKeyBal[sender] -= amount;
	//balances[recipient] = (balances[recipient] || 0) + +amount;
	pubKeyBal[recipient] = (pubKeyBal[recipient] || 0) + +amount;
	//res.send({ balance: balances[sender] , message: "Transaction authenticated successfully" });
	res.send({ balance: pubKeyBal[sender] , message: "Transaction authenticated successfully" });
  }else {
	//res.send({ balance: balances[sender] , message: "Transaction authentication failed" });
	res.send({ balance: pubKeyBal[sender] , message: "Transaction authentication failed" });
}    
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
