import { isLogged, currentLogin } from '../services/auth.service.js';
import fs from "fs";

export async function loggedAndHasPermission(req){
    let ok = await isLogged(req);
    if (ok){
        try{
            const rawData = fs.readFileSync("/app/perms.json", 'utf8');
            const data = JSON.parse(rawData);
            if (data.authorized.includes(currentLogin(req))){
                return true
            }
        }catch(error){
            return false
        }

    }else{
        return false
    }
}