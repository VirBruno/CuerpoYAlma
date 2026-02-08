from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import extract
from datetime import datetime, timedelta
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base, get_db
from app import models
from app.models import (
    Profe,
    Alumna,
    Seguro,
    Clase,
    ReservaClase,
    Abono,
)
from app.schemas import (
    ProfeCreate, ProfeUpdate, ProfeResponse,
    AlumnaCreate, AlumnaUpdate, AlumnaResponse,
    SeguroCreate, SeguroUpdate, SeguroResponse,
    ClaseCreate, ClaseUpdate, ClaseResponse,
    ReservaClaseCreate, ReservaClaseResponse, ReservaClaseUpdate,
    AbonoCreate, AbonoUpdate, AbonoResponse
)

print("🔥 INICIANDO CUERPOYALMA BACKEND 🔥")

app = FastAPI(title="CuerpoyAlma API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("🧱 CREANDO TABLAS...")
Base.metadata.create_all(bind=engine)
print("✅ TABLAS LISTAS")


@app.get("/")
def root():
    return {"app": "cuerpoyalma", "status": "ok"}


# ===================== PROFES =====================

@app.post("/profes", response_model=ProfeResponse)
def crear_profe(profe: ProfeCreate, db: Session = Depends(get_db)):
    nuevo = Profe(**profe.model_dump())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


@app.get("/profes", response_model=list[ProfeResponse])
def listar_profes(db: Session = Depends(get_db)):
    return db.query(Profe).all()


@app.get("/profes/{profe_id}", response_model=ProfeResponse)
def obtener_profe(profe_id: int, db: Session = Depends(get_db)):
    profe = db.query(Profe).get(profe_id)
    if not profe:
        raise HTTPException(404, "Profe no encontrado")
    return profe


@app.put("/profes/{profe_id}", response_model=ProfeResponse)
def actualizar_profe(profe_id: int, datos: ProfeUpdate, db: Session = Depends(get_db)):
    profe = db.query(Profe).get(profe_id)
    if not profe:
        raise HTTPException(404, "Profe no encontrado")

    for k, v in datos.model_dump().items():
        setattr(profe, k, v)

    db.commit()
    db.refresh(profe)
    return profe


@app.delete("/profes/{profe_id}")
def eliminar_profe(profe_id: int, db: Session = Depends(get_db)):
    profe = db.query(Profe).get(profe_id)
    if not profe:
        raise HTTPException(404, "Profe no encontrado")

    db.delete(profe)
    db.commit()
    return {"detail": "Profe eliminado"}


# ===================== ALUMNAS =====================

@app.post("/alumnas", response_model=AlumnaResponse)
def crear_alumna(alumna: AlumnaCreate, db: Session = Depends(get_db)):
    nueva = Alumna(**alumna.model_dump())
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva


@app.get("/alumnas", response_model=list[AlumnaResponse])
def listar_alumnas(db: Session = Depends(get_db)):
    return db.query(Alumna).all()


@app.get("/alumnas/{alumna_id}", response_model=AlumnaResponse)
def obtener_alumna(alumna_id: int, db: Session = Depends(get_db)):
    alumna = db.query(Alumna).get(alumna_id)
    if not alumna:
        raise HTTPException(404, "Alumna no encontrada")
    return alumna


@app.put("/alumnas/{alumna_id}", response_model=AlumnaResponse)
def actualizar_alumna(alumna_id: int, datos: AlumnaUpdate, db: Session = Depends(get_db)):
    alumna = db.query(Alumna).get(alumna_id)
    if not alumna:
        raise HTTPException(404, "Alumna no encontrada")

    for k, v in datos.model_dump().items():
        setattr(alumna, k, v)

    db.commit()
    db.refresh(alumna)
    return alumna


@app.delete("/alumnas/{alumna_id}")
def eliminar_alumna(alumna_id: int, db: Session = Depends(get_db)):
    alumna = db.query(Alumna).get(alumna_id)
    if not alumna:
        raise HTTPException(404, "Alumna no encontrada")

    db.delete(alumna)
    db.commit()
    return {"detail": "Alumna eliminada"}


# ===================== SEGUROS =====================

@app.post("/seguros", response_model=SeguroResponse)
def crear_seguro(seguro: SeguroCreate, db: Session = Depends(get_db)):
    nuevo = Seguro(**seguro.model_dump())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


@app.get("/seguros", response_model=list[SeguroResponse])
def listar_seguros(db: Session = Depends(get_db)):
    return db.query(Seguro).all()


@app.get("/seguros/{seguro_id}", response_model=SeguroResponse)
def obtener_seguro(seguro_id: int, db: Session = Depends(get_db)):
    seguro = db.query(Seguro).get(seguro_id)
    if not seguro:
        raise HTTPException(404, "Seguro no encontrado")
    return seguro


@app.put("/seguros/{seguro_id}", response_model=SeguroResponse)
def actualizar_seguro(seguro_id: int, datos: SeguroUpdate, db: Session = Depends(get_db)):
    seguro = db.query(Seguro).get(seguro_id)
    if not seguro:
        raise HTTPException(404, "Seguro no encontrado")

    for k, v in datos.model_dump().items():
        setattr(seguro, k, v)

    db.commit()
    db.refresh(seguro)
    return seguro


@app.delete("/seguros/{seguro_id}")
def eliminar_seguro(seguro_id: int, db: Session = Depends(get_db)):
    seguro = db.query(Seguro).get(seguro_id)
    if not seguro:
        raise HTTPException(404, "Seguro no encontrado")

    db.delete(seguro)
    db.commit()
    return {"detail": "Seguro eliminado"}


# ===================== CLASES =====================

@app.post("/clases", response_model=ClaseResponse)
def crear_clase(clase: ClaseCreate, db: Session = Depends(get_db)):
    nueva = Clase(**clase.model_dump())
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva


@app.get("/clases", response_model=list[ClaseResponse])
def listar_clases(db: Session = Depends(get_db)):
    return db.query(Clase).all()


@app.get("/clases/{clase_id}", response_model=ClaseResponse)
def obtener_clase(clase_id: int, db: Session = Depends(get_db)):
    clase = db.query(Clase).get(clase_id)
    if not clase:
        raise HTTPException(404, "Clase no encontrada")
    return clase


@app.put("/clases/{clase_id}", response_model=ClaseResponse)
def actualizar_clase(clase_id: int, datos: ClaseUpdate, db: Session = Depends(get_db)):
    clase = db.query(Clase).get(clase_id)
    if not clase:
        raise HTTPException(404, "Clase no encontrada")

    for k, v in datos.model_dump().items():
        setattr(clase, k, v)

    db.commit()
    db.refresh(clase)
    return clase


@app.delete("/clases/{clase_id}")
def eliminar_clase(clase_id: int, db: Session = Depends(get_db)):
    clase = db.query(Clase).get(clase_id)
    if not clase:
        raise HTTPException(404, "Clase no encontrada")

    db.delete(clase)
    db.commit()
    return {"detail": "Clase eliminada"}


# ===================== RESERVAS =====================

@app.post("/reservas", response_model=ReservaClaseResponse)
def reservar_clase(reserva: ReservaClaseCreate, db: Session = Depends(get_db)):

    clase = db.query(Clase).get(reserva.clase_id)
    if not clase:
        raise HTTPException(404, "Clase no encontrada")

    # Cupo
    cupo = (
        db.query(ReservaClase)
        .filter(
            ReservaClase.clase_id == reserva.clase_id,
            ReservaClase.fecha_clase == reserva.fecha_clase,
            ReservaClase.estado == "ACTIVA",
        )
        .count()
    )

    if cupo >= clase.cantidad_alumnas:
        raise HTTPException(400, "La clase ya está completa")

    # Recuperaciones por mes
    if reserva.es_recuperacion:
        mes = reserva.fecha_clase.month
        anio = reserva.fecha_clase.year

        recuperaciones = (
            db.query(ReservaClase)
            .filter(
                ReservaClase.alumna_id == reserva.alumna_id,
                ReservaClase.es_recuperacion.is_(True),
                extract("month", ReservaClase.fecha_clase) == mes,
                extract("year", ReservaClase.fecha_clase) == anio,
            )
            .count()
        )

        if recuperaciones >= 2:
            raise HTTPException(400, "Máximo 2 recuperaciones por mes")

    nueva = ReservaClase(
        alumna_id=reserva.alumna_id,
        clase_id=reserva.clase_id,
        fecha_clase=reserva.fecha_clase,
        es_recuperacion=reserva.es_recuperacion,
        estado="ACTIVA",
    )

    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva


@app.put("/reservas/{reserva_id}/cancelar")
def cancelar_reserva(reserva_id: int, db: Session = Depends(get_db)):
    reserva = db.query(ReservaClase).get(reserva_id)
    if not reserva:
        raise HTTPException(404, "Reserva no encontrada")

    if datetime.utcnow() <= reserva.fecha_clase - timedelta(hours=6):
        reserva.estado = "CANCELADA_A_TIEMPO"
    else:
        reserva.estado = "NO_ASISTIO"

    reserva.cancelada_en = datetime.utcnow()
    db.commit()

    return {"detail": "Reserva cancelada"}

@app.get("/reservas")
def listar_reservas(db: Session = Depends(get_db)):
    return db.query(ReservaClase).all()


@app.put("/reservas/{reserva_id}", response_model=ReservaClaseResponse)
def actualizar_clase(reserva_id: int, datos: ReservaClaseUpdate, db: Session = Depends(get_db)):
    reserva = db.query(ReservaClase).get(reserva_id)
    if not reserva:
        raise HTTPException(404, "Reserva no encontrada")

    for k, v in datos.model_dump().items():
        setattr(reserva, k, v)

    db.commit()
    db.refresh(reserva)
    return reserva


@app.delete("/reservas/{reserva_id}")
def eliminar_reserva(reserva_id: int, db: Session = Depends(get_db)):
    reserva = db.query(ReservaClase).get(reserva_id)
    if not reserva:
        raise HTTPException(404, "Reserva no encontrada")

    db.delete(reserva)
    db.commit()
    return {"detail": "Reserva eliminada"}


# ===================== ABONOS =====================

@app.post("/abonos", response_model=AbonoResponse)
def crear_abono(abono: AbonoCreate, db: Session = Depends(get_db)):
    nueva = Abono(**abono.model_dump())
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva


@app.get("/abonos", response_model=list[AbonoResponse])
def listar_abonos(db: Session = Depends(get_db)):
    return db.query(Abono).all()


@app.get("/abonos/{abono_id}", response_model=AbonoResponse)
def obtener_abono(abono_id: int, db: Session = Depends(get_db)):
    abono = db.query(Abono).get(abono_id)
    if not abono:
        raise HTTPException(404, "Abono no encontrada")
    return abono


@app.put("/abonos/{abono_id}", response_model=AbonoResponse)
def actualizar_abono(abono_id: int, datos: AbonoUpdate, db: Session = Depends(get_db)):
    abono = db.query(Abono).get(abono_id)
    if not abono:
        raise HTTPException(404, "Abono no encontrada")

    for k, v in datos.model_dump().items():
        setattr(abono, k, v)

    db.commit()
    db.refresh(abono)
    return abono


@app.delete("/abonos/{abono_id}")
def eliminar_abono(abono_id: int, db: Session = Depends(get_db)):
    abono = db.query(Abono).get(abono_id)
    if not abono:
        raise HTTPException(404, "Abono no encontrada")

    db.delete(abono)
    db.commit()
    return {"detail": "Abono eliminada"}