// ==UserScript==
// @name         AutoGainMoney
// @match        https://ourcoin.xyz/faucet/*
// @match        https://ourcoinfaucet.xyz/doge-faucet/*
// @connect      ourcoinfaucet.xyz
// @connect      ourcoin.xyz
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// ==/UserScript==


(function() {
    'use strict';




        var doge ="DSHjLz7ULdxXQnVaBX9kt1osbVYiQYJqqr";
        var ltc="MGQ9B4oCpXa15A3gXVcuUobi5yvXLRzmVE";



        var websiteData = [
        {url : "https://ourcoinfaucet.xyz/doge-faucet/?r=DNbbh78HVZQTAKpUurd5XqqCytGupMqB57", address: doge},
        {url : "https://ourcoin.xyz/faucet/?r=MJiQetasxEppYiKc3c1PSpEqyFs1Qyesur", address: ltc},
        ];
        var websiteMap = [{website : ["ourcoin.xyz/faucet","ourcoinfaucet.xyz"],
        inputTextSelector: "#wpbf_address",captchaButtonSubmitSelector: "#wpbf-claim-form",
        allMessageSelectors: [".alert.alert-success",".alert.alert-danger",".alert.alert-info", "h1"],
        messagesToCheckBeforeMovingToNextUrl: ["Recharg", "You have to wait","was sent","sufficient","successfully","wrong","system","network", "Sorry"],formSubmit: true},];



       function triggerEvent(el, type) {
        try{
            var e = document.createEvent('HTMLEvents');
            e.initEvent(type, false, true);
            el.dispatchEvent(e);
        }catch(exception){
            console.log(exception);
        }
        }
        String.prototype.includesOneOf = function(arrayOfStrings) {

           if (!Array.isArray(arrayOfStrings)) {
            return this.toLowerCase().includes(arrayOfStrings.toLowerCase());
        }

        for (var i = 0; i < arrayOfStrings.length; i++) {
            if (this.toLowerCase().includes(arrayOfStrings[i].toLowerCase())) {
                return true;
            }
        }
        return false;
        }

         var websiteDataValues = {};
            for (let value of Object.values(websiteMap)) {
            if(window.location.href.includesOneOf(value.website)){
            websiteDataValues.inputTextSelector= value.inputTextSelector;
            websiteDataValues.inputTextSelectorButton = value.inputTextSelectorButton;
            websiteDataValues.defaultButtonSelectors = value.defaultButtonSelectors;
            websiteDataValues.claimButtonSelector = value.claimButtonSelector;
            websiteDataValues.captchaButtonSubmitSelector = value.captchaButtonSubmitSelector;
            websiteDataValues.allMessageSelectors = value.allMessageSelectors;
            websiteDataValues.messagesToCheckBeforeMovingToNextUrl = value.messagesToCheckBeforeMovingToNextUrl;
            websiteDataValues.balanceSelector = value.balanceSelector;
            websiteDataValues.successMessageSelectors = value.successMessageSelectors;
            websiteDataValues.additionalFunctions = value.additionalFunctions;
            websiteDataValues.timeoutbeforeMovingToNextUrl = value.timeoutbeforeMovingToNextUrl;
            websiteDataValues.formSubmit = value.formSubmit;
            break;
            }
            }
        var count = 0;
    var addressAssigned = false;
    for (let value of Object.values(websiteData)) {
        count = count + 1;
        if(value.url.includes(window.location.hostname) && (window.location.href.includes("/" + value.coin + "/") || window.location.href.includes("/" + value.coin + "-"))){
            websiteDataValues.address = value.address;
            addressAssigned = true;
            break;
        }
        }
       if(!addressAssigned){
        count = 0;
        for (let value of Object.values(websiteData)) {
            count = count + 1;

            if(value.url.includes(window.location.hostname)){
             if(value.regex){
             if(GM_getValue("UrlRegex")){
             if(GM_getValue("UrlRegex") == value.regex){
             websiteDataValues.address = value.address;
              break;
              }
              }else{
              GM_setValue("UrlRegex",value.regex);
              websiteDataValues.address = value.address;
              break;
              }

              }else{
               websiteDataValues.address = value.address;
               break;
                }
                }
                }
                }
               async function getNextUrl(){
                if(count >= websiteData.length){
            count = 0;
            websiteDataValues.nextUrl = websiteData[count].url;
            websiteDataValues.regex = websiteData[count].regex;
        }else{
            websiteDataValues.nextUrl = websiteData[count].url;
            websiteDataValues.regex = websiteData[count].regex;
        }
         pingTest(websiteDataValues.nextUrl);
         }

    var isNextUrlReachable = false;
     function pingTest(websiteUrl) {
       console.log(websiteUrl);
        GM_xmlhttpRequest({
          method: "GET",
            url: websiteUrl,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            timeout: 8000,
            onload: function(response) {
            isNextUrlReachable = true;
            },
            onerror: function(e) {
                count=count+1;
                getNextUrl();
            },
            ontimeout: function() {
                count=count+1;
                getNextUrl();
            },
            });

            }


            async function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms))
            }


            var movingToNextUrl = false;
            async function goToNextUrl() {
            if(!movingToNextUrl){
            movingToNextUrl = true;
            getNextUrl();
            while (!isNextUrlReachable) {
                await delay(3000);
            }

            if( websiteDataValues.regex){
                GM_setValue("UrlRegex", websiteDataValues.regex);
            }
            window.location.href = websiteDataValues.nextUrl;
            movingToNextUrl = true;
           }
           }
           async function goToWithdrawPage() {
           if(!movingToNextUrl){
            movingToNextUrl = true;
            window.location.href = websiteDataValues.withdrawPageUrl;
           }
           }
       var delayBeforeMovingToNextUrl = 120000;
    if(websiteDataValues.timeoutbeforeMovingToNextUrl){
        delayBeforeMovingToNextUrl = websiteDataValues.timeoutbeforeMovingToNextUrl;
    }

    setTimeout(function(){
        movingToNextUrl = false;
        goToNextUrl();
    },delayBeforeMovingToNextUrl);
       if (window.location.href.includes("to=FaucetPay") || websiteDataValues.address.length < 5 || websiteDataValues.address.includes("YOUR_")){
        goToNextUrl();
    }
       function messageSelectorsPresent(){
        if(websiteDataValues.allMessageSelectors){
            for(var j=0;j<websiteDataValues.allMessageSelectors.length;j++){
                for(var k=0; k< document.querySelectorAll(websiteDataValues.allMessageSelectors[j]).length;k++){
                    if(document.querySelectorAll(websiteDataValues.allMessageSelectors[j])[k] &&
                       (document.querySelectorAll(websiteDataValues.allMessageSelectors[j])[k].innerText.includesOneOf(websiteDataValues.messagesToCheckBeforeMovingToNextUrl) ||
                        (document.querySelectorAll(websiteDataValues.allMessageSelectors[j])[k].value &&
                          document.querySelectorAll(websiteDataValues.allMessageSelectors[j])[k].value.includesOneOf(websiteDataValues.messagesToCheckBeforeMovingToNextUrl)))){
                           return true;
                    }
                    }
                    }
                    }
                    return false;
                    }
       function checkMessageSelectorsLength(){
        if(websiteDataValues.allMessageSelectors){
            for(var j=0;j<websiteDataValues.allMessageSelectors.length;j++){
                for(var k=0; k< document.querySelectorAll(websiteDataValues.allMessageSelectors[j]).length;k++){
                    if(document.querySelectorAll(websiteDataValues.allMessageSelectors[j])[k] &&
                       (document.querySelectorAll(websiteDataValues.allMessageSelectors[j])[k].innerText.length > 0) ||
                       (document.querySelectorAll(websiteDataValues.allMessageSelectors[j])[k].value &&
                        document.querySelectorAll(websiteDataValues.allMessageSelectors[j])[k].value.length > 0)){
                        return true;
                    }
                    }
                    }
                    }
                    return false;
                    }
        function successMessageSelectorsPresent(){
        if(websiteDataValues.successMessageSelectors){
            for(var j=0;j<websiteDataValues.successMessageSelectors.length;j++){
                for(var k=0; k< document.querySelectorAll(websiteDataValues.successMessageSelectors[j]).length;k++){
                    if(document.querySelectorAll(websiteDataValues.successMessageSelectors[j])[k] && document.querySelectorAll(websiteDataValues.successMessageSelectors[j])[k].innerText.includesOneOf(websiteDataValues.messagesToCheckBeforeMovingToNextUrl)){
                        return true;
                    }
                    }
                    }
                    }
                    return false;
                    }
        function freePerfectMoneyCaptcha(){
        if(document.querySelector("#captcha") && document.querySelector("#user_input")){
            document.querySelector("#user_input").value = document.querySelector("#captcha").value ;
        }
        }
       function faucetTop() {
        if(!movingToNextUrl && checkMessageSelectorsLength()){
        goToNextUrl();
               }

               if(document.querySelectorAll(websiteDataValues.inputTextSelectorButton).length >=2 ){
            movingToNextUrl = true;
            return;
        }

        if(document.querySelector(".h-captcha")) {
            movingToNextUrl = true;
            return;
        }

                for(var hc=0; hc < document.querySelectorAll("iframe").length; hc++){
               if(document.querySelectorAll("iframe")[hc] &&
               document.querySelectorAll("iframe")[hc].hasAttribute("data-hcaptcha-response")) {
               movingToNextUrl = true;
            }
            }
            }

          setTimeout(function(){
         if( websiteDataValues.additionalFunctions){
            websiteDataValues.additionalFunctions();
            }
        if(websiteDataValues.withdrawEnabled){
            if(websiteDataValues.balanceSelector && document.querySelector(websiteDataValues.balanceSelector)){
                var currentBalance = document.querySelector(websiteDataValues.balanceSelector).innerText;
                if(currentBalance > websiteDataValues.withdrawMinAmount && !window.location.href.includes(websiteDataValues.withdrawPageUrl)) {
                    goToWithdrawPage();
                }

            }else{
                if(successMessageSelectorsPresent()){
                    goToWithdrawPage();
                }
                }
                }
                if(!movingToNextUrl && messageSelectorsPresent()){
                goToNextUrl();
                }
                if(!movingToNextUrl && websiteDataValues.defaultButtonSelectors){
                for(var i=0;i<websiteDataValues.defaultButtonSelectors.length ;i++){
                if(document.querySelector(websiteDataValues.defaultButtonSelectors[i])){
                    triggerEvent(document.querySelector(websiteDataValues.defaultButtonSelectors[i]), 'mousedown');
                    triggerEvent(document.querySelector(websiteDataValues.defaultButtonSelectors[i]), 'mouseup');
                    document.querySelector(websiteDataValues.defaultButtonSelectors[i]).click();
                    break;
                }
                }
                }
                if(!movingToNextUrl && document.querySelector(websiteDataValues.inputTextSelector)){
            document.querySelector(websiteDataValues.inputTextSelector).value = websiteDataValues.address;
            setTimeout(function(){
                if(websiteDataValues.inputTextSelectorButton && document.querySelector(websiteDataValues.inputTextSelectorButton)){
                    document.querySelector(websiteDataValues.inputTextSelectorButton).click();
                }
                },5000);
                }
                var clicked = false;
                var captchaInterval = setInterval(function(){
                try{
                if(!clicked && unsafeWindow.grecaptcha && unsafeWindow.grecaptcha.getResponse().length > 0){
                    if(websiteDataValues.formSubmit){
                        document.querySelector(websiteDataValues.captchaButtonSubmitSelector).submit();
                    }else{
                        document.querySelector(websiteDataValues.captchaButtonSubmitSelector).click();
                    }
                    clicked = true;

                    clearInterval(captchaInterval);
                    setTimeout(function(){
                    if(messageSelectorsPresent()){
                    goToNextUrl();
                    }
                    },5000);
                    }
                    }catch(e){
                    }
                   for(var hc=0; hc < document.querySelectorAll("iframe").length; hc++){
                   if(! clicked && document.querySelectorAll("iframe")[hc] &&
                   document.querySelectorAll("iframe")[hc].hasAttribute("data-hcaptcha-response") &&
                   document.querySelectorAll("iframe")[hc].getAttribute("data-hcaptcha-response").length > 0) {
                   if(websiteDataValues.formSubmit){
                        document.querySelector(websiteDataValues.captchaButtonSubmitSelector).submit();
                    }else{
                        document.querySelector(websiteDataValues.captchaButtonSubmitSelector).click();
                    }
                    clicked = true;
                    clearInterval(captchaInterval);
                    setTimeout(function(){
                        if(messageSelectorsPresent()){
                            goToNextUrl();
                        }
                        },5000);
                        }
                        }
                        },5000);
                        },5000);
                })();