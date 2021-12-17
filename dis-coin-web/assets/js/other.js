window.onload = function(){
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('userid');
    if(myParam != null){
        document.getElementById('userid').value = myParam; 
    }
}

