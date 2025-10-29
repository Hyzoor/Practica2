import axios from "axios"
import express from "express"
import cors from "cors"


type LD = {
    id: number,
    filmName: string,
    rotationType: "CAV" | "CLV",
    region: string,
    lengthMinutes: number,
    videoFormat: "NTSC" | "PAL"
}

let discos: LD[] = [
    { id: 1, filmName: "Disco1", rotationType: "CLV", region: "Japan", lengthMinutes: 47, videoFormat: "NTSC" },
    { id: 2, filmName: "Disco2", rotationType: "CAV", region: "Japan", lengthMinutes: 48, videoFormat: "PAL" },
    { id: 3, filmName: "Disco3", rotationType: "CLV", region: "Japan", lengthMinutes: 49, videoFormat: "NTSC" },
]


const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => res.send("Bienvenido a la API de discos"))

app.get("/ld", (req, res) => res.json(discos))

app.get("/ld/:id", (req, res) => {
    const id = Number(req.params.id);

    const disco = discos.find((x) => x.id === id);
    // Find devuelve el valor del primer elemento, en caso contrario undefined
    disco === undefined ? res.status(404).json({ message: "Disco no encontrado" }) : res.json(disco)
})

app.post("/ld", (req, res) => {

    const nuevoDisco: LD = {
        id: Date.now(),
        ...req.body
    }

    discos.push(nuevoDisco);
    res.json(nuevoDisco);
})

app.delete("/ld/:id", (req, res) => {
    const id = Number(req.params.id);

    const disco = discos.find((x) => x.id === id)

    if (!disco) {
        res.status(404).json({ message: "El disco no existe, no ha sido posible eliminarlo" });
        return;
    }
    const nuevosDiscos = discos.filter((x) => !(x.id === id));
    discos = nuevosDiscos;
    res.json({ message: "Disco eliminado correctamente" });


})

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
    const discosIniciales: LD[] = (await axios.get(endpoint)).data;
    console.log(discosIniciales);

    //Segunda prueba
    console.log("Discos tras agregar uno nuevo")
    await axios.post(endpoint, { filmName: "Disco5", rotationType: "CAV", region: "Japan", lengthMinutes: 137, videoFormat: "NTSC" })
    const discosNuevos: LD[] = (await axios.get(endpoint)).data;
    console.log(discosNuevos);

    //Tercera prueba
    console.log("Discos tras eliminar eliminar el ultimo");
    const idToDelete = discos.at(-1)?.id;
    await axios.delete(endpoint + `/${idToDelete}`);
    const discosFinales: LD[] = (await axios.get(endpoint)).data;
    console.log(discosFinales);

}







