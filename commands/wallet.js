const Moralis  = require('moralis/node');
const { GetBalance} = require("../Functions");
const { addMessageDelete } = require('../utils/messageCleanUp');

exports.run = async (client, message, args) => {
    if(args[0] == null){
        const params = {userid : message.author.id, contractAddress : global.contractAddress, BscChain : global.BscChain};
        const bal = await Moralis.Cloud.run("returnBalanceOfUser",params);
        const balDc = await GetBalance(message.author.id);
        
        if(bal == -1)
            ShowWallet(message.channel,balDc);
        else
            ShowWalletBoth(message.channel,balDc,bal);
        
        return ;
    }
    const params = {userid : args[0], contractAddress : global.contractAddress, BscChain : global.BscChain};
    var bal = await Moralis.Cloud.run("returnBalanceOfUser",params);
    if(bal == -1){
        const exampleEmbed = {
            color: 0xffffff,
            title: 'Error',
            description: "This address either doesn't exist or doesn't have any D-C in it",
        };
        
        return ;
    }
    ShowWalletBSC(message.channel,bal);
}

function ShowWallet(channel,balance){
    if(balance == null) balance = 0;

    const exampleEmbed = {
        color: 0xffffff,
        title: 'Your wallet information',
        description: 'You can set your BSC wallet with .bind\u200B',
        fields:[
            {name:'Balance',value:balance.toFixed(1) + ' D-C',inline:true},
            {name:'Value',value:balance*global.Price + ' $',inline:true},
        ]
    };
    channel.send({ embeds: [exampleEmbed] });
}

function ShowWalletBSC(channel,balance){
    if(balance == null) balance = 0;

    const exampleEmbed = {
        color: 0xffffff,
        title: 'BSC wallet information',
        fields:[
            {name:'Balance',value:balance.toFixed(1) + ' D-C',inline:true},
            {name:'Value',value:balance*global.Price + ' $',inline:true},
        ]
    };
    channel.send({ embeds: [exampleEmbed] });
}

async function ShowWalletBoth(channel,balance,balanceBSC){
    if(balance == null) balance = 0;
    if(balanceBSC == null)balanceBSC = 0;

    const exampleEmbed = {
        color: 0xffffff,
        
        title: 'Your wallet information',
        fields:[
            {name:'Discord wallet',value:balance.toFixed(1) + ' D-C (' + balance*global.Price + '$)',inline:true},
            {name:'BSC wallets',value:balanceBSC.toFixed(1) + ' D-C (' + balanceBSC*global.Price + '$)',inline:true},
        ]
    };
    channel.send({ embeds: [exampleEmbed] });
}

/*Moralis.Cloud.define("returnBalanceOfUser", async (userid,contractAddress,BscChain) => {

    const query = new Moralis.Query("User");
    console.log(userid);
    query.equalTo("userid", userid);
    const results = await query.find({useMasterKey:true});
    var bal = 0;
    console.log(results.length);
    if(results.length > 0){
        for (let i = 0; i < results.length; i++) {
            const object = results[i];
            const options = { chain: BscChain, address: object.get("ethAddress")}
            const balances = await Moralis.Web3API.account.getTokenBalances(options);
            const parsed = JSON.parse(balances);
                
            for(var i = 0; i < parsed.length; i++){
                if(parsed[i]["token_address"] == contractAddress)
                    bal += parsed[i]["balance"];
            }
        }
    }
    else bal = -1;
    return bal;
});*/
