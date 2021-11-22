const express = require('express');
const User = require('../Document/user');
const app = express();

app.get('/', function (req, res, next) {
	return res.render('signup.ejs');
});

app.post('/', function(req, res, next) {
	var personInfo = req.body;
	if(!personInfo.email || !personInfo.username || !personInfo.password || !personInfo.passwordConf){
		res.send();
	} else {
		if (personInfo.password == personInfo.passwordConf) {

			User.findOne({email:personInfo.email},function(err,data){
				if(!data){
					var c;
					User.findOne({},function(err,data){
						if (data) {
							c = data.unique_id + 1;
						}else{
							c=1;
						}

						var newPerson = new User({
							unique_id:c,
							email:personInfo.email,
							username: personInfo.username,
							password: personInfo.password,
							passwordConf: personInfo.passwordConf
						});

						newPerson.save();

					}).sort({_id: -1}).limit(1);
					res.send({"Success":"You are regestered,You can login now."});
				}else{
					res.send({"Success":"That Email Is Taken. Try Another."});
				}

			});
		}else{
			res.send({"Success":"password is not matched"});
		}
	}
});

app.get('/login', function (req, res, next) {
	return res.render('login.ejs');
});

app.post('/login', function (req, res, next) {
	User.findOne({email:req.body.email},function(err,data){
		if(data){
			
			if(data.password==req.body.password){
				req.session.userId = data.unique_id;
				res.send({"Success":"Success!"});
				
			}else{
				res.send({"Success":"Password Not Matched!"});
			}
		}else{
			res.send({"Success":"That Email Is Not Found!"});
		}
	});
});

app.get('/profile', function (req, res, next) {
	User.findOne({unique_id:req.session.userId},function(err,data){
		if(!data){
			res.redirect('/');
		}else{
			return res.render('data.ejs', {"name":data.username,"email":data.email});
		}
	});
});

app.get('/logout', function (req, res, next) {
	if (req.session) {
    req.session.destroy(function (err) {
    	if (err) {
    		return next(err);
    	} else {
    		return res.redirect('/');
    	}
    });
}
});
module.exports = app;