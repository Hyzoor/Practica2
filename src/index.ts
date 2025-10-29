import axios from "axios"
import express from "express"
import cors from "cors"
import type { LD } from "./types"
import router, { discos } from "./discos"


const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());
app.use('/ld', router)

app.listen(port, async () => {
    console.log("Servidor en http://localhost:" + port)
    await delay(1000);
    await testApi();
});


const delay = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const testApi = async () => {


    const endpoint: string = "http://localhost:3000/ld"

    // Primera prueba
    console.log("Discos iniciales")
    const discosIniciales = (await axios.get<LD[]>(endpoint)).data;
    console.log(discosIniciales);

    //Segunda prueba
    console.log("Discos tras agregar uno nuevo")
    await axios.post(endpoint, { filmName: "Disco5", rotationType: "CAV", region: "Japan", lengthMinutes: 137, videoFormat: "NTSC" })
    const discosNuevos = (await axios.get<LD[]>(endpoint)).data;
    console.log(discosNuevos);

    //Tercera prueba
    console.log("Discos tras eliminar eliminar el ultimo");
    const idToDelete = discosNuevos[discosNuevos.length - 1].id;
    await axios.delete(endpoint + `/${idToDelete}`);
    const discosFinales = (await axios.get<LD[]>(endpoint)).data;
    console.log(discosFinales);

    //Cuarta prueba del put
    console.log("Discos tras actualizar el primer disco");
    const idToPut = 1;
    await axios.put(endpoint + `/${idToPut}`, { filmName: "DiscoActualizado" })
    const discosActualizados = (await axios.get<LD[]>(endpoint)).data;
    console.log(discosActualizados)
}







