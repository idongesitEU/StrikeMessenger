function setTrig() {
	verifyKeys("PRIVATE_KEY", "PRIVATE_KEY");
	ScriptApp.newTrigger('doPost').forSpreadsheet(SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1-thw_Q_QSkdKe-6yR8OYRA59jKLBaMVam2OOiO6QqLc/edit?usp=drivesdk")).onFormSubmit();;
}
const getTime = ()=> {
	let ts = new Date();
	ts = ts. toString();
	let rs = ts.indexOf("GMT");
	//	console. log(typeof(rs) );
	ts = ts. substr(0, rs);
	//	console.log(ts);
	return ts;
}
function getLines(list, a, b) {
	const newList = [[],
		[]];
	for (let i = 0; i < list.length; i++) {
		newList[0].push(list[i][a]);
		newList[1].push(list[i][b]);
	};
	return newList;
};
function chatHistory(key) {
	const ss = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1-thw_Q_QSkdKe-6yR8OYRA59jKLBaMVam2OOiO6QqLc/edit?usp=drivesdk").getActiveSheet();
	const val = ss.getSheetValues(1, 1, ss.getLastRow(), ss.getLastColumn());
	const messages = getLines(val, 0, 2);
	//console.log(messages);
	return ContentService.createTextOutput(JSON.stringify(messages)).setMimeType(ContentService.MimeType.JSON);
}
function verifyKeys(publicKey, privateKey) {
	//verify public and private keys
	//console.log(publicKey,privateKey);
	const ss = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1-thw_Q_QSkdKe-6yR8OYRA59jKLBaMVam2OOiO6QqLc/edit?usp=drivesdk");
	var a,
	b;
	//Verify private key
	ss.setActiveSheet(ss.getSheetByName("PrivateKeys"));
	if (ss.getSheetValues(1, 1, 1, ss.getLastColumn())[0].indexOf(privateKey)>-1)a = true;
	//verify public key
	//console.log(ss.getSheetValues(1,1,1,ss.getLastColumn()));
	ss.setActiveSheet(ss.getSheetByName("PublicKeys"));
	//console.log (ss.getSheetValues(1,1,ss.getLastRow(),1));
	if (ss.getSheetValues(1, 1, 1, ss.getLastColumn())[0].indexOf(publicKey)>-1)b = true;
	if (a == true && b == true) {
		ss.setActiveSheet(ss.getSheetByName("chatHistory"));
		return true;
	} else {
		//console.log(a,b);
		throw "invalid keys";
	}
}
function doPost(e/*={parameter:{

privateKey:"PRIVATE_KEY",
publicKey:"78d0a611b12a0b5427d56daca0cb10712e28ca7f1b15aaeca06568010c0c562c",
message:"love",
version:1.0,
protocol:"send"
}
}*//*={
	parameter:{ privateKey: "PRIVATE_KEY",
   publicKey: "f20180075104c1a2de12c6112eadca11a61b0863f726ac00fb747a4a267dada2",
    message: "Send me a copy of the money",
    version: "1.0",
    protocol: "send" }
}*/) {
	//GmailApp.sendEmail("2002rawlife@gmail.com","e params",JSON.stringify(e));
	const request = e.parameter;
	// console.log(request.privateKey);
	try {
		//var lock=LockService.getScriptLock();
		//lock.tryLock(1300);
		verifyKeys(request.publicKey, request.privateKey);
		const email = "2002rawlife@gmail.com";
		// GmailApp.sendEmail(email,"Keys verified !","The keys have been sucessfully veryfied");
		if (request.protocol === "send") {
			const ss = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1-thw_Q_QSkdKe-6yR8OYRA59jKLBaMVam2OOiO6QqLc/edit?usp=drivesdk");
			ss.setActiveSheet(ss.getSheetByName("chatHistory"));
			//console.log(typeof(ss.getLastRow()))
			// console.log(ss.getSheetValues(1,1,1,1))

			const newMessage = [];
			newMessage.push([request.message]);
			newMessage.push([request.privateKey]);
			newMessage.push([request.publicKey]);
			newMessage.push([request.version]);
			newMessage.push([getTime()]);
			newMessage.push(["unread"])
			// console.log(ss.getLastRow());
			// ss.getActiveSheet().getRange(1,1).getValue();
			//get last row and increment value by one
			let lastRow = ss.getLastRow(); lastRow++;

			for (let i = 0; i < 5; i++) {
				ss.getActiveSheet().getRange(lastRow, i+1).setValue(newMessage[i][0]);
			}
			return ContentService.createTextOutput(JSON.stringify("sent")).setMimeType(ContentService.MimeType.JSON);

		} else if (request.protocol === "history") {
			return chatHistory();
		}
	}catch(e) {
		console.log(e);
		GmailApp.sendEmail("2002rawlife@gmail.com", "error;occoured", e.message);
		return ContentService.createTextOutput(`${e.message}`).setMimeType(ContentService.MimeType.JSON);
		Logger.log("error message: %s", e.message);

	} finally {
		//  lock.releaseLock();
	}
}
