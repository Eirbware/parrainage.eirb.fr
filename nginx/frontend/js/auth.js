const BACKEND_ME = '/api/me'
const BACKEND_LOGIN = '/api/login'

document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname == "/auth.html"){
        logUser()
    }
})

async function userIsLoggedIn(){
    let is_co = false;
    try {
      const res = await fetch(BACKEND_ME, { credentials: "include",});
      if (res.ok){ //Ok = true when connected 
        is_co = true; 
      }
      return is_co;

    } catch (error) {
      return is_co;
    }
}


export async function logUser(){
    let the_user_logged = await userIsLoggedIn();

    if (!the_user_logged){
      window.location.href = BACKEND_LOGIN;
    }else{
      window.location.pathname = "/index.html";
    }
}