import { PlantacionesCard } from "../CardFinanzas";
import { CosechasList } from "../components/cosechas/CosechasList";

export function Cosechas(){
    return(
        <div>
            <div className="p-4">
                <PlantacionesCard/>
            </div>

            <CosechasList/>
        </div>
    )
}