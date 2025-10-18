function CreateAccount(){
    const username=document.getElementById("username").value;
    const password=document.getElementById("password").value;
    const confirmPassword=document.getElementById("confirmPassword").value;
    if(password==confirmPassword){
        const creation=fetch(`/accountCreation?username=${username}&password=${password}`);
        creation.then(function(info){
            alert(info.username);
        })
    }
}