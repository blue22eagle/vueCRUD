//					بسم الله الرحمن الرحيم

//const MongoClient = require('mongodb');

const	node_path= "../../node-v16.13.0/node_modules/",		//'/usr/local/lib/node_modules/',
        express= require(node_path+ 'express'),
        app= express(),
        //path = require('path'),
        cookieParser= require(node_path+ 'cookie-parser'),
        session = require(node_path+ 'express-session'),
        colors= require(node_path+ 'colors'),
        port = process.env.PORT || process.argv[2] || 8000;
		MongoClient = require(node_path+ 'mongodb').MongoClient,
		//MongoStore= require('connect-mongo')(ExpressSession),
		url = 'mongodb://localhost:27017';

/*async function main() {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('documents');
    
    // the following code examples can be pasted here...
    
    return 'done.';
}
main()
.then(console.log)
.catch(console.error)
.finally(() => client.close());*/

var db;
MongoClient.connect(url, function(err, connection) {
	if (err) throw err;
	console.log(("Connected successfully to Mongodb").green.bold);
	db= connection.db('mydb');
	//app.set('views', path.join(__dirname, 'vuejs'))
	app.set('views', __dirname)
	//.set('trust proxy', 1) // trust first proxy, nginx 
	.use(express.static(__dirname))
	.use(express.urlencoded({extended: false})) // parse application/x-www-form-urlencoded
	.use(express.json()) // parse application/json
	.use(session({
		secret: "mysecret",
		cookie: {
			//secure: true,
			maxAge: 1000* 60* 5		// 5mn
		},
		saveUninitialized: true,
		resave: false,
		sameSite: true
	}))
	.use(cookieParser("mysecret"))
	.get('/', (req, res)=> res.render('index.html'))
	.get('/api/read', (req, res)=> {
        db.collection('myCollection').find().project({_id: 0}).sort({id: 1}).toArray(function(err, result) {
			if (err) throw err;
			res.json(result);
		});
	})
	.get('/api/write', (req, res)=> {
		db.collection('myCollection').insertMany([
		{id: 1, LName: 'ZEBIDA', FName: 'Youcef', BirthDay: '2009/11/19', Age: 11},
		{id: 2,	LName: 'ZEBIDA', FName: 'Younes', BirthDay: '2011/08/08', Age: 9},
		{id: 3,	LName: 'ZEBIDA', FName: 'Mohamed', BirthDay: '2018/10/21', Age: 2}, 
		{time: new Date()}
		], function(err, result) {
			if (err) throw err;
			//console.log(result.insertedCount+ " Documents inserted");
			console.log(result);
			connection.close();
		});
	})
    .get('*', (req, res)=> {	//	/(.+)/ instead * if you like regular expression
		if (req.session.myuserid)
			console.log("\nUser: "+ req.session.myuserid);
		else
			console.log("\nNot logged in yet");
		res.send(req.url);
		console.log(req.url.green.bold);
		if (req.url== "/session") {
			console.log(req.session);
			console.log(req.cookies);
			console.log(req.signedCookies);
		}
	})
	.listen(port, () => {
		console.log((`Server is running on http://localhost:${port}\nStart at: `+ new Date().toLocaleString()).cyan.bold);
	});
	process.on('SIGINT', function() {
		connection.close();
		console.log(('Connection closed').green.bold);
		process.exit(0);
	});
});
