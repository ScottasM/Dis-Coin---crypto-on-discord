const { mClient } = require("../Functions");

exports.run = async (client, message, args) => {

    const mainDB = mClient.db("Dis-Coin");

    const results = await mainDB.collection("Users").findOne({"userid" : message.author.id},{"_id":0,"Losses":1,"Wins":1,"Won":1,"Total":1});
    
    let l=0,w=0,won=0,t=0;
    
    t = results.Total
    l = results.Losses;
    w = results.Wins;
    won = results.won;

    if(t == null)
        t = 0;
    if(l == null)
        l = 0;
    if(w == null)
        w = 0;
    if(won == null)
        won = 0;

        
    const exampleEmbed = {
        color: 0xffffff,
        title: 'Your gambling statistics',
        fields:[
            {name:'Total games: ',value:t.toString(),inline:true},
            {name:'Wins: ',value:w.toString() + ' (' + (w > 0 ? (w/t*100).toFixed(1) : 0) + '%)',inline:true},
            {name:'Losses: ',value:l.toString() + ' (' + (l > 0 ? (l/t*100).toFixed(1) : 0) + '%)',inline:true},
            {name:'Winnings: ',value:won.toString() + ' D-C',inline:true},
        ]
    };
    message.channel.send({embeds : [exampleEmbed]});
}