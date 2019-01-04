'use strict';
angular.module('gujaratSamachar')
    .service('metaService', metaService);

function metaService(GENERAL_CONFIG) {
    var title = "Gujarat Samachar : World's Leading Gujarati Newspaper, Gujarati News, News in Gujarati, Gujarat News, News from Ahmedabad, Baroda, Bhuj, Bhavnagar, Rajkot, Surat, Gujarati News Headlines, Gujarati Headlines, Breaking News, 2G Spectrum Scam Exposed, 2g Scam Explained, video clip, muncipal, kite, festival, ahmedabad news, Politics news, opposition party, congress, bjp, health, relations";
    var metaDescription = "Gujarat Samachar is world's highest selling Gujarati Newspaper. Our portal connects people of Indian diaspora worldwide. This website provides news about India, USA, Finance, Movies, Music, Bollywood, beauty and lifestyle, politics, technology and purti. We also offer classifieds for jobs and marriages. Expand your social network. Site also provides information on shopping deals, mobile phone deals, travel deals.";
    var metaKeywords = 'News from Ahmedabad,News from Baroda,Gujarati Newspaper,Ahmedabad News,Baroda News,Gujarati News live,Gujarati, Gujrati News,Gujarat Samachar,Gujarati News,Gujarati News Paper,Gujarati News paper,gujrat,samachar,gujarati garba,news from Ahmedabad,news from Baroda,news from Surat,magazine,purti,gujarat samachar,gujarat, gujarati news, news, india, ahmedabad, narendra modi, bjp, congress, election, politics, nrg, nri, baroda, bhavnagar, rajkot, surat, vadodara, sandesh, bhaskar, times, songs, bollywood, films, movies, business, finance, rent, android, ipod, iphone, mac, phone, mobile, ring tone,usa,america,ravi purti,Gujarati News Headlines,Gujarati Headlines';
    var metaImage = GENERAL_CONFIG.app_base_url + '/assets/images/GSlogo_200.jpg';
    var heading;
    return {
        set: function(newTitle, newMetaDescription, newKeywords, newImage, headLine) {
            metaKeywords = newKeywords;
            metaDescription = newMetaDescription;
            title = newTitle;
            metaImage = newImage;
            heading =  headLine;
        },
        metaTitle: function() { return title; },
        metaDescription: function() { return metaDescription; },
        metaKeywords: function() { return metaKeywords; },
        metaImage: function() { return metaImage; },
        heading: function() { return heading; }
    }
}