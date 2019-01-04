var ACCOUNT_VERIFICATION_EMAIL_TEMPLATE = function(userInfo) {	
	var template = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">'+
	'<html xmlns="http://www.w3.org/1999/xhtml">'+
	'<head>'+
	'<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />'+
	'<title>Welcome to Gujarat Samachar</title>'+
	'<style>'+
	'@media only screen and (min-width:481px) and (max-width:599px) {'+
	'table[class="em_main_table"] { width: 100% !important; text-align: center !important; }'+
	'table[class="em_wrapper"] { width: 100% !important; }'+
	'td[class="em_spacer"] { width: 10px !important; }'+
	'td[class="em_title"] { font-size: 24px !important; line-height: 36px !important; }'+
	'td[class="em_hide"], table[class="em_hide"], span[class="em_hide"], br[class="em_hide"] { display: none !important; width: 0px; max-height: 0px; overflow: hidden; }'+
	'img[class="em_full_img"] { width: 100% !important; height: auto !important; }'+
	'img[class="em_full_img1"] { width: 45% !important; height: auto !important; }'+
	'img[class="em_full_img1"] { width: 37% !important; height: auto !important; text-align:center }'+
	'td[class="em_txt_center"] { text-align: center !important; }'+
	'}'+
	' '+
	'/*Stylesheed for the devices width between 0px to 480px*/'+
	'@media only screen and (max-width:480px) {'+
	'table[class="em_main_table"] { width: 100% !important; background-image: none !important; }'+
	'table[class="em_wrapper"] { width: 100% !important; }'+
	'td[class="em_spacer"] { width: 10px !important; }'+
	'td[class="em_hide"], table[class="em_hide"], span[class="em_hide"], br[class="em_hide"] { display: none !important; width: 0px; max-height: 0px; overflow: hidden; }'+
	'img[class="em_full_img"] { width: 100% !important; height: auto !important; }'+
	'img[class="em_full_img1"] { width: 45% !important; height: auto !important; }'+
	'img[class="em_full_img1"] { width: 37% !important; height: auto !important; text-align:center !important; }'+
	'td[class="em_title"] { font-size: 20px !important; line-height: 36px !important; }'+
	'td[class="em_height"] { height: 30px !important; }'+
	'td[class="em_txt_center"] { text-align: center !important; }'+
	'}'+
	'</style>'+
	'</head>'+
	''+
	'<body bgcolor="#ffffff" style="margin:0px; padding:0px; background:#ffffff; font-family:Arial;">'+
	''+
	'<table align="center" bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" width="100%">'+
	'    <!--first row-->'+
	'    <tbody><tr>'+
	'      <td align="center" valign="top"><table class="em_main_table" style="margin:auto;background-color:#ffffff;border:1px solid #BF0413;" align="center" border="0" cellpadding="0" cellspacing="0" width="600">'+
	'          <!--first row-->'+
	'          <tbody><tr>'+
	'            <td align="left" bgcolor="#1F2533" valign="top">'+
	'            <table class="em_main_table" align="center" bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" width="600">'+
	'                <tbody>'+
	'                <tr>'+
	'                  <td style="line-height:0px; font-size:0px;" height="10"> </td>'+
	'                </tr>'+
	'                <!----> '+
	'                <tr>'+
	'                  <td style="line-height:0px; font-size:0px;" height="10"> </td>'+
	'                </tr> '+
	'                <tr>'+
	'                  <td style="background:#F1F1F1; padding:15px 0;" align="center" bgcolor="#F1F1F1" valign="top">'+
	'                  <table class="em_main_table" align="center" border="0" cellpadding="0" cellspacing="0" width="600">'+
	'                  <tbody><tr>'+
	'                  '+
	'                  <td align="center" valign="top">'+
	'                  <table class="em_wrapper" align="center" border="0" cellpadding="0" cellspacing="0" width="570">'+
	'                  	  <tbody><tr>'+
	'                        <td align="left" valign="top">'+
	'                       	   <table class="em_wrapper" align="left" border="0" cellpadding="0" cellspacing="0" width="100%">'+
	'                            <tbody><tr>'+
	'                                <td align="center" valign="top" ><img class="em_full_img" src="http://52.66.146.218:5555/assets/images/logo.png"  /></td>'+
	'                            </tr>'+
	'                             '+
	'                            </tbody></table> '+
	'                        </td>'+
	'                      </tr>'+
	'                    </tbody></table>'+
	'                  </td> '+
	'                  </tr>'+
	'                  </tbody></table>  '+
	'                  </td>'+
	'                </tr>             '+
	'                <tr>'+
	'                	<td style="background:#ffffff;" align="left" bgcolor="#ffffff" valign="top">'+
	'                     <table class="em_main_table" align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border:1px solid #BF0413;border-right:0; border-left:0;">'+
	'                      <tbody>'+
	'                      <tr>'+
	'                      		<td style="line-height:0px; font-size:0px;" height="20"> </td>'+
	'                      </tr>'+
	'                      <tr>'+
	'                  <td style="background:#ffffff;" align="center" bgcolor="#ffffff" valign="top">'+
	'                  <table class="em_main_table" align="center" border="0" cellpadding="0" cellspacing="0" width="598">'+
	'                    <tbody>'+
	'                      <tr>'+
	'                        <td style="line-height:0px; font-size:0px; width:10px;" align="left" valign="top" width="10"></td>'+
	'                        <td align="center" valign="top">'+
	'                        <table class="em_wrapper" align="center" border="0" cellpadding="0" cellspacing="0" width="540">'+
	'                      	  <tbody>'+
	'                            <tr>'+
	'                            	<td style="line-height:0px; font-size:0px;" height="20"> '+
	'                              </td>'+
	'                            </tr>'+
	'                            <tr>'+
	'                              <td align="left" valign="top">'+
	'                             	   <table class="em_wrapper" align="left" border="0" cellpadding="0" cellspacing="0" width="100%">'+
	'                                  <tbody><tr>'+
	'                                      <td style="font-family:Arial, Helvetica, sans-serif; font-size:16px; color:#575757; text-align:left;" align="center" valign="top">'+
	'                                   		Hey '+userInfo.firstName+','+
	'                                      </td>'+
	'                                  </tr>'+
	'                                   <tr>'+
	'                                      <td style="line-height:0px; font-size:0px;" height="16"> </td>'+
	'                                   </tr>'+
	'                                    <tr>'+
	'                                      <td style="font-family:Arial, Helvetica, sans-serif; font-size:16px; color:#575757; text-align:left;" align="center" valign="top">'+
	'                                        We have successfully created your account in Gujarat Samachar.'+
	'                                        <p>Use the following credentials to login to your account :</p>'+
	'                                        Username : '+userInfo.email+'<br />'+
	'                                        Password : '+userInfo.password+'<br />'+
	'                                       '+
	'                                        We recommend you to please login with these credentials & change your password for added security.<br /><br />'+
	'                                        Your Login link here : <a href='+userInfo.loginLink+'>'+userInfo.loginLink+'</a>'+
	'                                      </td>'+
	'                                  </tr> '+
	'                                  <tr>'+
	'                                      <td style="line-height:0px; font-size:0px;" height="16"> </td>'+
	'                                  </tr>'+
	'                                  <tr>'+
	'                                      <td style="line-height:0px; font-size:0px;" height="20"> </td>'+
	'                                  </tr>'+
	'                                  <tr>'+
	'                                      <td style="font-family:Arial, Helvetica, sans-serif; font-size:16px; color:#575757; text-align:left;" align="center" valign="top">'+
	'                                   		-Team Gujarat Samachar'+
	'                                      </td>'+
	'                                  </tr> '+
	'                                  <tr>'+
	'                                      <td style="line-height:0px; font-size:0px;" height="40"> </td>'+
	'                                   </tr>'+
	'                                  </tbody></table></td>                        '+
	'                            </tr>'+
	'                          </tbody>'+
	'                        </table>'+
	'                        </td>'+
	'                      </tr>'+
	'                    </tbody>'+
	'                  </table>  '+
	'                  </td>'+
	'                </tr>'+
	'                      </tbody></table>'+
	'                    </td>'+
	'                </tr>'+
	'            '+
	'               <tr>'+
	'                  <td align="center" valign="top">'+
	'                	<table class="em_wrapper" align="center" border="0" cellpadding="0" cellspacing="0" width="570">'+
	'                    <tbody><tr>'+
	'                      <td align="left" valign="top">'+
	'                           <table class="em_wrapper" align="center" border="0" cellpadding="0" cellspacing="0" width="100%">'+
	'                             <tbody><tr>'+
	'                              <td align="left" valign="top">'+
	'                              <table class="em_wrapper" align="center" border="0" cellpadding="0" cellspacing="0">'+
	'                                <tbody>'+
	'                                <tr>'+
	'                                  <td style="line-height:0px; font-size:0px;" height="30"> </td>'+
	'                              </tr>'+
/*	'                                <tr>'+
	'                              <td class="em_txt_center" style="font-size:16px; color:#323232; text-align:center;" align="center" valign="top">Gujarat Samachar is available on your device</td>                              '+
	'                                </tr>'+
	'                                <tr>'+
	'                                  <td style="line-height:0px; font-size:0px;" height="20"> </td>'+
	'                              </tr>'+
	'                                <tr><td><table align="center" border="0" cellpadding="0" cellspacing="0" ><tbody>'+
	'                                <tr>'+
	'                                  <td align="center" valign="top"><a href="#"><img class="em_full_img" src="<?php echo $this->config->item(\'base_url\');?>images/playstore.png" alt="" style="display:block; max-width:142px; max-height:45px; " height="45" width="142"/></a></td>'+
	'                                    <td align="center" valign="top" width="5"></td>'+
	'                                    <td align="center" valign="top"><a href="#"><img class="em_full_img" src="<?php echo $this->config->item(\'base_url\');?>images/Appstore.png" alt="" style="display:block; max-width:142px; max-height:45px; " height="45" width="142"/></a></td>'+
	'                              </tr>'+
	'                                <tr>'+
	'                                  <td style="line-height:0px; font-size:0px;" height="30"> </td>'+
	'                              </tr>'+*/
	'                                </tbody></table></td></tr>'+
	'                                </tbody></table>'+
	'                                  '+
	'                                </td>'+
	'                             </tr>'+
	'                           </tbody></table>'+
	'                        </td>'+
	'                    </tr>'+
	'                    </tbody></table>'+
	'            </td>'+
	'          </tr>'+
	'                <tr>'+
	'                  <td align="center" valign="top">'+
	'                    <table class="em_main_table" align="center" border="0" cellpadding="0" cellspacing="0" width="600">'+
	'                    <tbody><tr>'+
	'                  <td style="line-height:0px; font-size:0px; width:15px;" align="left" valign="top" width="15"></td>'+
	'                    <td align="center" valign="top">'+
	'                    <table class="em_wrapper" align="center" border="0" cellpadding="0" cellspacing="0" width="570">'+
	'                    <tbody><tr>'+
	'                      <td align="left" valign="top">'+
	'                           <table class="em_wrapper" align="center" border="0" cellpadding="0" cellspacing="0" width="100%">'+
	'                             <tbody><tr>'+
	'                              <td align="left" valign="top">'+
	'                              <table class="em_wrapper" align="center" border="0" cellpadding="0" cellspacing="0">'+
	'                                <tbody>'+
	'                                <tr>'+
	'                                  <td style="line-height:0px; font-size:0px;" height="15"> </td>'+
	'                              </tr>'+
	'                                <tr>'+
	'                              <td class="em_txt_center" style="font-size:16px; color:#323232; text-align:center;" align="center" valign="top">Follow @gujratsamachar</td>                              '+
	'                                </tr>'+
	'                                <tr>'+
	'                                  <td style="line-height:0px; font-size:0px;" height="20"> </td>'+
	'                              </tr>'+
	'                                <tr><td><table align="center" border="0" cellpadding="0" cellspacing="0" ><tbody>'+
	'                                <tr>'+
	'                                  <td align="center" valign="top"><a href="https://www.facebook.com/Gujarat.Samachar.News"><img class="em_full_img" src="http://52.66.146.218:5555/assets/images/fb_icon.png" alt="" style="display:block; max-width:40px; max-height:40px; " height="40" width="40"/></a></td>'+
	'                                    <td align="center" valign="top" width="5"></td>'+
	'                                    <td align="center" valign="top"><a href="https://twitter.com/gujratsamachar?lang=en"><img class="em_full_img" src="http://52.66.146.218:5555/assets/images/twitter_icon.png" alt="" style="display:block; max-width:40px; max-height:40px; " height="40" width="40"/></a></td>'+
	'                              </tr>'+
	'                                <tr>'+
	'                                  <td style="line-height:0px; font-size:0px;" height="25"> </td>'+
	'                              </tr>'+
	'                                </tbody></table></td></tr>'+
	'                                </tbody></table>'+
	'                                  '+
	'                                </td>'+
	'                             </tr>'+
	'                           </tbody></table>'+
	'                        </td>'+
	'                    </tr>'+
	'                    </tbody></table>'+
	''+
	'                    </tbody>'+
	'                    </table>'+
	'                  </td>'+
	'                </tr>'+
	'                <tr>'+
	'                    <td style="line-height:0px; font-size:0px; background:#BF0413;" height="1" bgcolor="BF0413"></td>'+
	'                </tr>'+
	'                <tr>'+
	'                <td style="line-height:0px; font-size:0px;" height="10"> </td>'+
	'                </tr>'+
	'                            '+
	'                            	<tr>'+
	'                                	<td style="line-height:0px; font-size:0px;" height="10"> </td>'+
	'                             	</tr>'+
	'                                <tr>'+
	'                             	<td class="em_txt_center" style="font-size:13px; color:#323232; text-align:center;" align="center" valign="top">Copyright © Gujarat Samachar</td>                              '+
	'                                </tr>'+
	'                                <tr>'+
	'                                	<td style="line-height:0px; font-size:0px;" height="20"> </td>'+
	'                             	</tr>               '+
	'              </tbody></table>'+
	'            </td>'+
	'          </tr>'+
	'        </tbody></table></td>'+
	'    </tr>'+
	'  </tbody></table>'+
	'</body>'+
	'</html>';
	
	return template;
}

var resObj = {
	ACCOUNT_VERIFICATION_EMAIL_TEMPLATE : ACCOUNT_VERIFICATION_EMAIL_TEMPLATE
}
module.exports = resObj;