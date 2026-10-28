import express  from 'express';
import fs from "fs";
import {loggedAndHasPermission} from '../services/perm.js'

const router = express.Router();



router.get('/getData', async (req, res) => {
    try {
            fs.readFile("./data.json", "utf8", (err, jsonString) => {
            if (err) {
              console.log("File read failed:", err);
              return;
            }
            console.log("File data:", jsonString);
            res.send(jsonString);
        
            });
    } catch (error) {
        res.send("Erreur lors de la lecture du fichier");
    }

});


async function setInfo(req){
        try {
            // 1. Read and Parse
            const rawData = fs.readFileSync("./data.json", 'utf8');
            const data = JSON.parse(rawData);

            let success = false

            switch (req.body.filiere){
                case "informatique":
                    data.informatique = data.informatique + req.body.valeur
                    success = true
                    break;
                case "electronique":
                    data.electronique = data.electronique + req.body.valeur;
                    success = true
                    break;
                case "SEE":
                    data.SEE = data.SEE + req.body.valeur;
                    success = true
                    break;
                case "RI":
                    data.RI = data.RI + req.body.valeur;
                    success = true
                    break;
                case "matmeca":
                    data.matmeca = data.matmeca + req.body.valeur;
                    success = true
                    break;
                case "telecom":
                    data.telecom = data.telecom + req.body.valeur;
                    success = true
                    break;
            }
            try {
                fs.writeFileSync('data.json', JSON.stringify(data, null, 2));

            } catch (error) {
                return { accepted: false, msg: error }

            }
            if (success)
                return { accepted: true, msg: "" }
            return { accepted: false, msg: "Erreur" }


        } catch (error) {
            return { accepted: false, msg: "Erreur lors du changement d'informations" }
        }
}


router.post('/setData', async (req, res) => {
    let ok = await loggedAndHasPermission(req);
    if (ok){
        const rsp = await setInfo(req);
        //If all tests are good: 
        if (rsp.accepted === true){
          res.status(201).json({
            success: true,
          })
        }else {
          res.status(401).json({
            success: false,
            message: rsp.msg
          })
        }
    }else{
        res.send("Erreur, vous n'avez pas les permissions d'accéder à cette route")
    }
})
export default router;
