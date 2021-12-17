exports.run = (client, message, args) => {
    message.author.send("Use this link and the user id field will be filled automatically. http://91.225.104.24?userid="+message.author.id);
}

/*
if(args[0] == null){
        const exampleEmbed = {
            color: 0xffffff,
            title: 'Error',
            description: 'You have to input a BSC wallet address',
        };
        message.channel.send({ embeds: [exampleEmbed] });
        return;
    }

    global.https.get('https://api.bscscan.com/api?module=account&action=tokenbalance&contractaddress=0x359f35085202C8527a0c767557339635A335Eb76&address='+args[0]+'&tag=latest&apikey=' + global.APIKey,resp =>{
        resp.on('uncaughtException', function (err) {
            console.log(err);
            return;
        });
        let data = '';
        // A chunk of data has been received.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            var obj = JSON.parse(data);
            if(obj.status == 0){
                const exampleEmbed = {
                    color: 0xffffff,
                    title: 'Error',
                    description: 'Oops! Something went wrong. Please check if the wallet adress is correct.',
                };
                message.channel.send({ embeds: [exampleEmbed] });
            }
            else{
                var balance = obj.result;
                balance = balance / 100000000000000000;
                if(balance == 0){
                    const exampleEmbed = {
                        color: 0xffffff,
                        title: 'Error',
                        description: "This wallet doesn't have any DCoin in it!.",
                    };
                    message.channel.send({ embeds: [exampleEmbed] });
                    return ;
                }

                global.UserData[message.author.id].Wallet = args[0];
                global.fs.writeFileSync(global.DataPath, JSON.stringify(global.UserData, null, 2));
                
                const exampleEmbed = {
                    color: 0xffffff,
                    title: 'Success',
                    description: "Your wallet has been sucessfully updated. You can now use .wallet to check its info.",
                };
                message.channel.send({ embeds: [exampleEmbed] });
            }
        });
    });
*/