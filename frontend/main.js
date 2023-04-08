let buttonLogin = document.querySelector("#login");
let h2 = document.querySelector("h2");
let buttonGetUsers = document.querySelector("#getUsers");
let loginBox = document.querySelector(".login-box")
let buttonRegister = document.querySelector("#register");
let greetingg = document.querySelector(".greeting");



if (sessionStorage.getItem("token")) {
    loginBox.classList.add("hidden");
}

/*Vi gör en POST-request för inloggning och registrering.
Inlogg: definiera 2 saker:
först URL sedan http-body med config som har 3 saker: metod- get är default, därav skriver vi POST, body(stringyfied objekt), headers som säger content type- "det är json data vi postar".

Man skickar alltid med en body med POST-request med info vi vill skicka till Strapi.

Vi pushar data till Strapi, vi gör en POST mot url:en api/auth/local och pushar med info delen- ett objekt med identifier (namn eller email) och password- vi stringifyar detta.

console.loggar vi responsen, kan vi kolla i network-> preview och application för mer information om error osv.

Lyckas vi logga in får vi i responen, jwt(nyckel) och info om användaren: id, namn och email.

jwt lagras i browsern i sessionStorage. För att göra autentiserade requests framöver behöver vi ha med denna nyckel i varje typ av request vi gör för att visa att vi är autentiserade.

data.jwt är av värde för oss.

sessionStorage är data som finns kvar även om vi refreshar sidan och hoppar mellan olika undersidor. Kolla då, har vi det i sessionStorage? Har vi då lagrat jwt i brower är det bara att köra.
*/

let login = async () => {
    let username = document.querySelector("#username");
    let password = document.querySelector("#password");

    let info = {
        identifier: username.value,
        password: password.value
    };
    let response = await fetch("http://localhost:1337/api/auth/local", {
        method: "POST",
        body: JSON.stringify(info),
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (response.ok) {
        let data = await response.json();

        /*Här sparar/lagrar vi jwt i vår sessionstories i "token"
        Vi sätter ett värde i sessionStorage, alltså vår jwt. Vi sätter vårt tokenet.*/
        sessionStorage.setItem("token", data.jwt);
        sessionStorage.setItem("user", data.user.username);
        console.log("Got out token!");
        console.log(data);

        /*här kör vi ompageload pg.a. om vi loggat in vill vi refresha sidan, alltså ta bort fält som ej ska synas som inloggad*/
        onPageLoad();
    } else {
        let errorMessage = document.createElement("h3");
        errorMessage.innerText = "Felaktiga inloggningsuppgifter!";
        loginBox.append(errorMessage);
    }
};


/*Exempel på autentiserad request. Vi behöver då skicka med vårt jwt/token, och innan dess spara jwt, genom session storage. jwt är unikt för varje inloggning/session

"För att hämta information om alla användare/för att komma åt detta API behöver man vara autentiserad"

Vi har sparat vår jwt i "token". Detta gör att när vi klickat runt på sidan och alla dess undersior så har vi tillgång till vår sessionStorage.

Vi vill nu göra detta till autentiserat request för att hämta alla användare, vi skickar då med en header med denna sessionStorage token.

Vi skickar inte med detta som en body pg.a. inget vi vill lagra. Vi skickar med det via headers. Vi behöver skicka med ett headers-objekt, som berättar lite om ens request. Vi skriver alltid Authorization med stort A.

Vi har satt vårt jwt till "token" därav skriver vi getItem "token" för det är token vi vill hämta.

När vi gör request som kräver nyckeln, slänger iv in den i headern.
*/
let getUsers = async () => {
    let response = await fetch("http://localhost:1337/api/users", {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
    });
    let data = await response.json();
    console.log(data);
}



let onPageLoad = async () => {
    if (sessionStorage.getItem("token")) {
        loginBox.classList.add("hidden");
        document.querySelector(".greeting").classList.remove("hidden");

        // window.location.href = "userpage.html";
        document.querySelector("#user").innerText = sessionStorage.getItem("user");

        /*I objektet vi får tillbaka med jwt och username får vi även ett id. Från id skulle man kunna göra en fetch och hämta information. Prova me istället för id- mer säkert. Annars kanske andra användare kan se andras info och man skickar med "toker"*/

        //Hämta information om den inloggade användaren
        // let response = await fetch("http://localhost:1337/api/users/me", {
        //   headers: {
        //     Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        //   },
        // });
        // let data = await response.json();
        // console.log(data);

    } else {
        console.log("No token!")
    }
};

onPageLoad();

/*man skickar med värdet i strapi, och den här posten vi gör kommer skapa upp en instans av content-type user som vi redan har användare i. Denna bodyn är ett objekt med 3 saker: */
let registerUser = async () => {
    let username = document.querySelector("#usernamereg");
    let password = document.querySelector("#passwordreg");
    let email = document.querySelector("#emailreg");

    let info = {
        username: username.value,
        password: password.value,
        email: email.value,
    };

    let response = await fetch("http://localhost:1337/api/auth/local/register", {
        //config
        method: "POST",
        body: JSON.stringify(info),
        headers: {
            "Content-type": "application/json"
        },

    });
    console.log(response);

    //kolla, om response.ok skicka iväg personen till sidan eller skriv ut felmeddelande.
}



buttonLogin.addEventListener("click", login);
buttonRegister.addEventListener("click", registerUser);

// buttonGetUsers.addEventListener("click", getUsers);



/*______________________________________________________ */

//GET-request
let getItems = async () => {
    //genom Fetch
    let responseFetch = await fetch("http://localhost:1337/api/items");
    let data = await responseFetch.json();
    console.log(data)
    //vi får ingen info om body eller header i bara responsen m. fetch

    //genom axios
    /*då får vi info om vad vi skcikat med i header och vi har vår response i data. Vi behöver alltså inte använda .json() */
    let response = await axios.get("http://localhost:1337/api/items");
    console.log(response.data)

}

document.querySelector("#get").addEventListener("click", getItems)

/*POST-request */
//Genom Fetch
let addItem = async () => {
    let responseFetch = await fetch("http://localhost:1337/api/items", {

        method: "POST",
        body: JSON.stringify({
            data: {
                Name: "Jordgubbe",
                price: 200,
            },
        }),
        headers: {
            "Content-Type": "application/json",
        },

    });

    console.log(responseFetch)
    //Genom Axios
    let response = await axios.post("http://localhost:1337/api/items", {
        data: {
            Name: "Ananas",
            price: 10,

        },
    });
    console.log(response)


};


document.querySelector("#post").addEventListener("click", addItem)

/*PUT-request*/
//Genom axios

// let edit = async (id) => {
//     let response = await axios.put(`http://localhost:1337/api/items/${id}`, {
//         data: {
//             Name: "",
//             price: 0,
//         },
//     });
//     console.log("Edited data: ", response)
// }

// let edit = async () => {
//     let response = await axios.put(`http://localhost:1337/api/items/1`, {
//         data: {
//             Name: "Passionsfrukt",
//             price: 1000,
//         },
//     });
//     console.log("Edited data: ", response)
// }

//PUT-request. Autentiserad
let edit = async () => {
    let response = await axios.put(`http://localhost:1337/api/items/5`,
        {
            data: {
                Name: "Passionsfrukt",
                price: 1000,
            },
        },
        {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        },
    );
    console.log("Edited data: ", response)
}

document.querySelector("#put").addEventListener("click", edit)

/*DELETE-request*/

let deleteItem = async (id) => {
    let response = await fetch("http://localhost:1337/api/items/1", {
        method: "DELETE",
    });
    let data = await response.json();
    console.log(data)
}

document.querySelector("#delete").addEventListener("click", deleteItem)

