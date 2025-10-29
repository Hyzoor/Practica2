import { Router } from "express";
import type { LD } from "./types";


export let discos: LD[] = [
    { id: 1, filmName: "Disco1", rotationType: "CLV", region: "Japan", lengthMinutes: 47, videoFormat: "NTSC" },
    { id: 2, filmName: "Disco2", rotationType: "CAV", region: "Japan", lengthMinutes: 48, videoFormat: "PAL" },
    { id: 3, filmName: "Disco3", rotationType: "CLV", region: "Japan", lengthMinutes: 49, videoFormat: "NTSC" },
]

const router = Router();

const validateLDData = (data: any): string | null => {

    if (!data) return "No se ha proporcionado ningún dato en el body";

    const updates: Partial<LD> = data;

    if ("filmName" in updates && typeof updates.filmName !== "string") return "El nombre tiene que ser una cadena de caracteres";
    if ("region" in updates && typeof updates.region !== "string") return "La región tiene que ser una cadena de caracteres";
    if ("lengthMinutes" in updates && typeof updates.lengthMinutes !== "number") return "La longitud tiene que ser un número entero";
    if ("rotationType" in updates && updates.rotationType !== "CAV" && updates.rotationType !== "CLV") return "El tipo de rotación ha de ser CAV o CLV";
    if ("videoFormat" in updates && updates.videoFormat !== "NTSC" && updates.videoFormat !== "PAL") return "El formato tiene que ser NTSC o PAL";

    return null;
};

router.get("/", (req, res) => res.json(discos))

router.get("/:id", (req, res) => {
    const id = Number(req.params.id);

    const disco = discos.find((x) => x.id === id);

    return disco
        ? res.status(404).json({ messgage: "Disco no encontrado" })
        : res.json(disco)
})

router.post("/", (req, res) => {

    try {

        const error = validateLDData(req.body);
        if (error) return res.status(400).json({ error });


        const nuevoDisco: LD = {
            id: Date.now(),
            ...req.body
        }

        discos.push(nuevoDisco);
        res
            .status(201)
            .json(nuevoDisco);

    } catch (err: any) {
        res
            .status(500)
            .json({ message: "Error al crear el LD", detail: err.message });
    }

})

router.delete("/:id", (req, res) => {

    try {
        const id = Number(req.params.id);

        const disco = discos.find((x) => x.id === id)

        if (!disco) return res.status(404).json({ message: "El disco no existe, no ha sido posible eliminarlo" });

        const nuevosDiscos = discos.filter((x) => !(x.id === id));
        discos = nuevosDiscos;

        res.json({ message: "Disco eliminado correctamente" });

    } catch (err: any) {
        res
            .status(500)
            .json({ message: "Error al eliminar el LD", detail: err.message })
    }

})

router.put("/:id", async (req, res) => {

    try {

        const id = Number(req.params.id);
        const index = discos.findIndex((x) => x.id === id)

        if (index === -1) return res.status(404).json({ message: "El disco que deseas actualizar no ha sido encontrado" });

        const error = validateLDData(req.body);
        if (error) return res.status(404).json({ error });

        discos[index] = { ...discos[index], ...req.body };
        res
            .json({ message: "LD actualizado correctamente", LD: discos[index] });

    } catch (err: any) {
        res
            .status(500)
            .json({ message: "Error al actualizar el ld", detail: err.message });
    }
})

export default router;