exports.run = (client, message, args) => {
    const exampleEmbed = {
        color: 0xffffff,
        title: 'Main commands',
        thumbnail: {url:'https://media.discordapp.net/attachments/879346086110699542/906629030088953917/D_1_1_2-modified.png'},
        description: 'To find more information about Dis-Coin, discord bot or fees go to basic info channel or our webiste dis-coin.com\n\u200B',
        fields:[
            {name:".info",value:"Check main information about Dis-Coin"},
            {name:".bind",value:"Provides link that fills user id box in website automatically"},
            {name:".gambling",value:"Provides basic information about gambling"},
            {name:".withdraw",value:"Withdraw a specific amount of coins from your discord balance to your BSC wallet"},
            {name:".send",value:"Send/Tip a specific amount of coins to other discord user"},
            {name:".wallet",value:"Check information about BSC and/or discord wallet or any other wallet(value, coins, age and etc.)\n\u200B"}
        ],
        footer: {
            text: 'Creator: Michael_Scott#6544',
            timestamp: new Date()
        },
    };
    
    message.channel.send({ embeds: [exampleEmbed] });
}