import Turret from "@/entities/Turret";
import Divisor from "@/entities/Divisor";
import ITurret from "@/entities/ITurret";
import Fee from "@/entities/Fee";

export default function mapTurret(turretData: ITurret, url: string): Turret {
  const { upload, run } = turretData.divisor;
  const { min, max, days } = turretData.fee;
  return new Turret(
    url,
    turretData.turret,
    turretData.network,
    turretData.horizon,
    turretData.runner,
    turretData.version,
    new Fee(min, max, days),
    new Divisor(upload, run)
  );
}
