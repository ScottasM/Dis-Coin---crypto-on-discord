const Moralis  = require('moralis/node');
Moralis.initialize("-----", "", "----");// change to your moralis server 
Moralis.serverURL = "----"; // change to your moralis server 
const { theReplacer } = require("./Functions");

const GetTransactions = async function(){
    const query = new Moralis.Query('BscTokenTransfers');

    query.equalTo('confirmed',true);
    query.equalTo('to_address',global.DiscordWallet);
    query.equalTo('token_address',global.contractAddress);

    const results = await query.find({useMasterKey:true});
    const Deposit = Moralis.Object.extend("Deposit");


    //console.log(JSON.stringify(results));

    if(results.length > 0){
        for(var i = 0;i<results.length; i++){
            const query1 = new Moralis.Query('User');
            
            query1.equalTo('ethAddress',results[i].get('from_address'));
            const results1 = await query1.first({useMasterKey:true});

            if(!results1)
                continue;

            const userid = results1.get('userid');
            if(!userid)
                continue;

            const Amount = results[i].get('value') / 10**18;
            let balance1;

            console.log('deposited ' + Amount);

            AddBalance(userid,parseInt(Amount));

            const functions = require("./Functions.js");
            functions.SendPM(userid,Amount,0);

            //const params = {userid : userid, results : results};
            //Moralis.Cloud.run("moveDeposit",params);
  
            
            const deposit = new Deposit();
        
            deposit.set("userid",userid);
            deposit.set("amount",Amount);
            deposit.set("fromWallet",results[i].get('from_address'));
            deposit.save({useMasterKey:true});
        
            results[i].destroy({useMasterKey:true});
            //results[i].save({useMasterKey:true});
        }
    }
}

function ClearUnwantedTransactions(){
    const params = {DiscordWallet : global.DiscordWallet,TokenAddress: global.contractAddress};
    Moralis.Cloud.run("deleteUnwantedTransactions",params);
}

setTimeout(GetTransactions,1000*20);
setInterval(GetTransactions,1000*60);

setTimeout(ClearUnwantedTransactions,1000*5);
setInterval(ClearUnwantedTransactions,1000*60*10);



