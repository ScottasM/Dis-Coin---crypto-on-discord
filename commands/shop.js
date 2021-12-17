const {GetServerData,SaveServerData, errorMessage, sucMessage, AddBalance, GetBalance} = require("../Functions.js")

exports.run = async (client, message, args) => {
    if(args[0] == null)
        ShowShop(message.channel,message.guild);
    else if(args[0] === "help"){
        const exampleEmbed = {
            color: 0xffffff,
            title: 'Server shop information',
            fields:[
                {name:'.shop:',value:"Check the shop"},
                {name:'.shop buy [id]:',value:"Buy a role from shop specifying its id"},
                {name:'.shop donate [amount]:',value:"Donate D-Cs to the server"},
                {name:'**Owner commands**',value:"--------"},
                {name:".shop remove [id]", value : "Remove a role from sale"},
                {name:".shop add [role id] [price] [maximum sold]",value:"Add a role to shop."},
                {name:".shop donations",value:"Toggle donations on or off"}
            ]
        };
        message.channel.send({embeds : [exampleEmbed]});
        return ;
    }

    serverData = await GetServerData(message.guild.id);


    if(args[0] === "donations"){
        if(message.guild.ownerId != message.author.id)
            return errorMessage(message.channel,"This function is only for the owner");
        let don;
        if(serverData == null || serverData.Shop == null){
            don = false;
            console.log("take false");
        } 
        else don = serverData.Shop.donations;
        SaveServerData(message.guild.id,3,!don);
        sucMessage(message.channel,'Donations successfully turned ' + (!don == true ? 'on' : 'off'),true);
    }
    else if(args[0] == "remove"){
        if(message.guild.ownerId != message.author.id)
            return errorMessage(message.channel,"This function is only for the owner");
        if(isNaN(args[1]))
            return errorMessage(message.channel,"You must enter an index for the role you want to remove. Check the indexes with .shop",true);
        if(serverData == null || serverData.Shop == null||serverData.Shop.Roles == null)
            return errorMessage(message.channel,"No roles are for sale in your shop",true);
        if(args[1] < 0 || args[1] > serverData.Shop.Roles.length)
            return errorMessage(message.channel,"Wrong role index",true);
        if(serverData.Shop.Roles[args[1]] == null || serverData.Shop.Roles[args[1]] == 0)
            return errorMessage(message.channel,"Role with such index doesn't exist in your shop");
        let vars = {roleid:serverData.Shop.Roles[args[1]].roleid};
        SaveServerData(message.guild.id,2,vars);
        sucMessage(message.channel,"Role successfully removed from shop",true);
    }
    else if(args[0] == "add"){
        if(message.guild.ownerId != message.author.id)
            return errorMessage(message.channel,"This function is only for the owner");
        let rid = parseInt(args[1]),price = parseInt(args[2]),max = parseInt(args[3]);
        if(rid == null || price == null || max == null)
            return errorMessage(message.channel,"Usage: .shop add [roleid] [price] [stock (0 - unlimited)]",true);
        if(price < 0)
            return errorMessage(message.channel,"Price cannot be less than 0",true);
        if(max < 0)
            return errorMessage(message.channel,"Stock cannot be less than 0 (0 for unlimited)",true);
        const role = message.guild.roles.cache.find((r) => r.id === args[1]);
        if(role == null)
            return errorMessage(message.channel,"Role with such id doesn't exist in your server",true);
        if(serverData == null || serverData.Shop == null || serverData.Shop.Roles == null || serverData.Shop.Roles.length < 5){
            const vars = {roleid:args[1],price:args[2],current:0,max:args[3]};
            SaveServerData(message.guild.id,1,vars);
            sucMessage(message.channel,"Role has been successfully put to sale",true);
        }
        else{
            errorMessage(message.channel,"You have reached the maximum amount for roles for sale (5). Please use .shop remove to make more space",true);
        }
    }
    else if(args[0] == "donate"){
        if(serverData == null || serverData.Shop == null || serverData.Shop.donations == null || serverData.Shop.donations == false)
            return errorMessage(message.channel,"Donations are currently turned off on this server",true);
        if(args[1] == null || isNaN(args[1]))
            return errorMessage(message.channel,"You have to input an amount you want to donate",true);
        if(args[1] < 1)
            return errorMessage(message.channel,"Minimum donation amoount - 1 D-C",true );
        if(GetBalance(message.author.id) < args[1])
            return errorMessage(message.channel,"You don't have enough D-Cs for your donation",true);
        AddBalance(message.author.id,-args[1]);
        SaveServerData(message.guild.id,0,parseInt(args[1]));
        sucMessage(message.channel,"Thank you for your donation of **" + args[1] + "** D-Cs");
    }
    else if(args[0] == "buy"){
        /*if(!global.client.member.permissions.has("MANAGE_ROLES"))
            return errorMessage(message.channel,"For this function to work, turn on Manage roles under dis-coin role. If you can't do that, contact the owner",true);*/
        /*if(!message.member.manageable)
            return errorMessage(message.channel,"Sorry, but i can't manage your roles. Please move me higher in the hierarchy",true);*/
        if(serverData == null || serverData.Shop == null || serverData.Shop.Roles == null)
            return errorMessage(message.channel,"No roles are for sale in this shop",true);
        if(args[1] == null)
            return errorMessage(message.channel,"You have to input the role index you want to buy. Use .shop to see them",true);
        if(args[1] < 0 || args[1] >= serverData.Shop.Roles.length)
            return errorMessage(message.channel,"Such role index doesn't exits",true);
        if(serverData.Shop.Roles[args[1]] == null || serverData.Shop.Roles[args[1]].roleid == null || serverData.Shop.Roles[args[1]].roleid == 0)
            return errorMessage(message.channel,"Role with such index doesn't exist in the shop",true);

        let rid = serverData.Shop.Roles[args[1]].roleid,prc = serverData.Shop.Roles[args[1]].price;

        if(GetBalance(message.author.id) < prc)
            return errorMessage(message.channel,"You don't have enough D-Cs for this role",true);
        if(message.member.roles.cache.has(rid))
            return errorMessage(message.channel,"You already have this role...",true);
        if(serverData.Shop.Roles[args[1]].max > 0 && serverData.Shop.Roles[args[1]].current+1 > serverData.Shop.Roles[args[1]].max)
            return errorMessage(message.channel,"This role has been sold out.",true);
            
        
        AddBalance(message.author.id,-prc);
        SaveServerData(message.guild.id,0,parseInt(prc));
        SaveServerData(message.guild.id,4,rid);

        let role = message.guild.roles.cache.find(r => r.id === rid);
        message.member.roles.add(role);

        sucMessage(message.channel,"Congratulations! You bought **"+role.name+"** role for **"+prc+"** D-C");
    }
}

async function ShowShop(channel,server){

    const serverData = await GetServerData(server.id);
    if(serverData == null || serverData.Shop == null){
        errorMessage(channel,"Server owner hasn't setup the shop yet. use .shop help for more information");
        return ;
    }

    let exampleEmbed = {
        color: 0xffffff,
        title: server.name + " shop",
        thumbnail: {url:'https://media.discordapp.net/attachments/879346086110699542/906629030088953917/D_1_1_2-modified.png'},
        description: '**' + server.name + '** has opened a shop. Users can buy roles using their dis-coins and support the community or even donate their prefered amount\n\u200B',
        fields:[]
    };
    
    if(serverData.Shop.Roles != null){
        
        for(let i = 0;i<serverData.Shop.Roles.length;i++){
            if(serverData.Shop.Roles[i] == null)
                continue;
            let role = server.roles.cache.find(r => r.id == serverData.Shop.Roles[i].roleid);
            if(role == null)
                continue;
            
            const cur = serverData.Shop.Roles[i].current;
            const max = serverData.Shop.Roles[i].max;

            exampleEmbed.fields.push({name:i + ': **' + role.name + '**',value:serverData.Shop.Roles[i].price + ' D-C (' + cur + '/' + (max == 0 ? 'unlimited' : max) + ')'});
        }
    }
    else exampleEmbed.fields.push({name:"Roles",value:"No roles are for sale on this server"});
    if(serverData.Shop.donations){
        exampleEmbed.fields.push({name:"Donations",value:"To donate to the server use .donate [amount]"});
    }
    else exampleEmbed.fields.push({name:"Donations",value:"Server isn't allowing donations"});
    
    channel.send({ embeds: [exampleEmbed] });
}