function consoleInit() {
    currencies = ["BTC","DOGE","LTC","ETH","BCH","XRP"];
}

function init() {
    console.log('hello Prime Dice');
    $$("bet_currency_selection").define("options", [
        {id:1,value:"BTC"},
        {id:2,value:"DOGE"},
        {id:3,value:"LTC"},
        {id:4,value:"ETH"},
        {id:5,value:"BCH"},
        {id:6,value:"XRP"},
    ]);
    $$("bet_currency_selection").refresh();
}

function checkParams(p,ch){
    //console.log(p,ch);
    if(p < 0.00000001 || p > 1000000000*1000000000) {
        return false
    }
    if(ch>98 || ch<0.01) {
        return false
    }
    return true;
}

function initScriptBalance(currencyValue, cb){
    getInfo(function(userinfo){
        if(userinfo.info.success == 'true'){
            try {
                balance = userinfo.info.balance;
                bets = userinfo.info.bets;
                wins = userinfo.info.wins;
                losses = userinfo.info.losses;
                profit = userinfo.info.profit;
            } catch(err){
                console.error(err.message);
                webix.message({type: 'error', text: err.message});
                return false;
            }
            cb();
        }
    });
}

function getBalance(userinfo){
    balance = userinfo.info.balance
    return parseFloat(balance);
}

function getProfit(userinfo){
    profit = userinfo.currentInfo.profit;
    //console.log('actprofit:'+actProfit);
    return parseFloat(profit);
}

function getCurrProfit(ret){
    currentprofit = ret.betInfo.profit
    //console.log('currprofit:'+currProfit);
    return parseFloat(currentprofit);
}

function getCurrentBetId(ret){
    let betId = ret.betInfo.iid;
    //console.log('currentBetId:'+betId);
    return betId;
}

function getCurrentRoll(ret){
    currentroll = ret.betInfo.roll;
    //console.log('currentRoll:'+roll);
    return currentroll;
}

function outError(ret){
    let mess = ret.err;
    return checkerr(mess);
}

function isError(ret){
    if(typeof ret.err != "undefined")
        return false;
    else
        return true;
}

function getWinStatus(ret){
    return ret.betInfo.win;
}

function setDatatable(ret){
    let chanceStr = '<font size="3" color="red">'+ ret.betInfo.condition + ' '+ ret.betInfo.target +'</font>';
    if(ret.betInfo.win){
        chanceStr = '<font size="3" color="green">'+ ret.betInfo.condition + ' '+ ret.betInfo.target +'</font>';
    }
    let profitStr = '<font size="3" color="red">' + ret.betInfo.profit+ '</font>';
    if(ret.betInfo.profit>0) {
        profitStr = '<font size="3" color="green">' + ret.betInfo.profit + '</font>';
    }
    $$('bet_datatable').add({
        bet_datatable_id:ret.betInfo.iid,
        bet_datatable_amount:ret.betInfo.amount,
        bet_datatable_low_high:ret.betInfo.condition,
        bet_datatable_payout:ret.betInfo.payout,
        bet_datatable_bet_chance:chanceStr,
        bet_datatable_actual_chance:ret.betInfo.roll,
        bet_datatable_profit:profitStr,
    },0);
}

function setStats(userinfo, cv){
    if(userinfo.info.success == 'true'){
        $$('bet_total_stats').setValues({
            bet_total_stats_balance:userinfo.info.balance,
            bet_total_stats_win:userinfo.info.wins,
            bet_total_stats_loss:userinfo.info.losses,
            bet_total_stats_bet:userinfo.info.bets,
            bet_total_stats_profit:userinfo.info.profit,
            bet_total_stats_wagered:userinfo.info.wagered,
        });
        $$('bet_current_stats').setValues({
            bet_current_stats_balance:userinfo.currentInfo.balance,
            bet_current_stats_win:userinfo.currentInfo.wins,
            bet_current_stats_loss:userinfo.currentInfo.losses,
            bet_current_stats_bet:userinfo.currentInfo.bets,
            bet_current_stats_profit:userinfo.currentInfo.profit,
            bet_current_stats_wagered:userinfo.currentInfo.wagered,
        });
    }
}

function consoleData(ret, iswin){
    let chanceStr = ret.betInfo.condition + ' '+ ret.betInfo.target;
    let profitStr = ret.betInfo.profit;
    datalog.log('betid:' +ret.betInfo.iid + ' amount:'+ ret.betInfo.amount+ ' low_high:'+ ret.betInfo.condition+' payout:'+ ret.betInfo.payout +' chance:'+chanceStr+' actual_chance:'+ ret.betInfo.roll +' profit:'+profitStr );
    return ret.betInfo.iid + ','+ ret.betInfo.amount+ ','+ ret.betInfo.condition+','+ (ret.betInfo.payout).toFixed(8) +','+chanceStr+','+ ret.betInfo.roll +','+profitStr;
}

function consoleStats(userinfo, cv){
    if(userinfo.info.success == 'true'){
        let info = JSON.stringify(userinfo.info);
        console.log(info.replace(/\"/g,""));
        wagered = userinfo.info.wagered;
        table1.setData(
            { headers: ['balance','profit', 'wagered','wins','bets','losses']
                , data:
                 [[userinfo.info.balance, userinfo.info.profit, userinfo.info.wagered, userinfo.info.wins, userinfo.info.bets, userinfo.info.losses]] });
        table2.setData(
            { headers: ['balance','profit', 'wagered','wins','bets','losses']
                , data:
                 [[userinfo.currentInfo.balance, userinfo.currentInfo.profit, userinfo.currentInfo.wagered, userinfo.currentInfo.wins, userinfo.currentInfo.bets, userinfo.currentInfo.losses]] });
        table3.setData(
            { headers: ['maxwinstreakamount','maxstreakamount','minstreakamount','maxbetamount','curstreak','maxwinstreak','maxlossstreak']
                , data:
                [[maxwinstreakamount, maxstreakamount.toFixed(8), minstreakamount.toFixed(8), maxbetamount, currentstreak, maxwinstreak, maxlossstreak]] });
        table1.focus()
        table2.focus()
        table3.focus()
        screen.render();
    }
}
