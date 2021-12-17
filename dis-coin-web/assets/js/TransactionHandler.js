Moralis.initialize(""); // Application id from moralis.io
Moralis.serverURL = ""; //Server url from moralis.io

function Bind(){
    const userid = document.getElementById('userid').value;
    if(userid.length == 0){
        alert('Please input your discord userid');
        return;
    }
    Moralis.authenticate().then(function (user) {
        if(user){
            if(user.get('userid') != userid){
                user.set('userid',userid);
            }
            else 
                alert("You already have this discord userid binded with your bsc wallet");
        }
        else{
            const user = new Moralis.User();
            //alert(document.getElementById("userid"))
            user.set('userid',document.getElementById('userid'));
        }
        alert("Wallet sucessfully binded with discord user");
        user.save();
    });
}

async function Depositas(){
    const amount = document.getElementById('coins').value;

    if(isNaN(amount)){
        alert("You have to input a number");
        return;
    }
    if(parseInt(amount) < 10 || parseInt(amount) > 1000000){
        alert("Depositing amount should be between 10 and 1000000 Dis-Coin");
        return;
    }

    Moralis.authenticate().then(async function (user) {
        const options = {type: "erc20",
            amount: Moralis.Units.Token(amount, "18"),
            receiver: "0x3ea77f6a92b3218b6f63c370606338e0fa783874",
            contractAddress: "0x64727c8a0c4a534e57fea1a9909f2b9941bd4ace"
        };

        try{
            let result = await Moralis.transfer(options);
        } catch(err){
            console.log(err);
        }
    });
    
    
}