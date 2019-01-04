var nodemailer  = require('nodemailer');
var randomToken = require('random-token');
var Q           = require('q');
var appConfig   = require('../../appConfig');
var smtpConfig  = {
	host: 'smtp.gmail.com',
	port: 465,
	secure: true, // use SSL
	auth: {
		user: appConfig.SUPER_ADMIN_EMAIL,
		pass: appConfig.SUPER_ADMIN_PASSWORD
	}
};
var randomToken = randomToken(16);
var transporter = nodemailer.createTransport(smtpConfig);

var service                             = {};
service.sendUserAccountConfirmationMail = sendUserAccountConfirmationMail;
service.sendNotificationMail            = sendNotificationMail;
module.exports                          = service;

function sendUserAccountConfirmationMail(reqHost, userInfo, userId) {
	var deferred = Q.defer();		
	// Mail body for company user confirmation mail
	var link = "http://" + reqHost + "/#/user/confirm?id=" + userId + "&code=" + randomToken+"&userEmail="+userInfo.email;
	var mailOptions = {
		from: appConfig.SUPER_ADMIN_EMAIL,
		to: userInfo.email,
		
		subject : "Account Confirmation Required",
		html : "<b>Hello,</b><br><br><b>"+ userInfo.firstName +" "+ userInfo.lastName +"</b> .Please Click on the link to confirm and activate the account.</b><br><br><center><b><a href="+link+">Click here to confirm</a></b></center><br><br><b>Regards,</b><br><b>The Gujarat Samachar Team<b/>"
	};	

	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        return deferred.reject(error);
	    }
	    deferred.resolve({
	    	"success":true,
	    	"message":'Message sent: ' + info.response,
	    	"data":{
	    		"randomToken": randomToken
	    	}
	    });
	});
	return deferred.promise;
}

function sendNotificationMail(mailSendTo, mailSubject, mailText, mailHtml){
	var deferred = Q.defer();
	var mailOptions = {
		from: appConfig.SUPER_ADMIN_EMAIL,
		to: mailSendTo,		
		subject : mailSubject,
		text : mailText,
		html : mailHtml
	};

	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        return deferred.reject(error);
	    }
	    deferred.resolve({
	    	"success":true,
	    	"message":'Message sent: ' + info.response,
	    	"data":{}
	    });
	});
	return deferred.promise;
}

/*************************BINDABLE FUNCTIONS START*************************/